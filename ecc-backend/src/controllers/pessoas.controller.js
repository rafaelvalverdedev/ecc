import supabase from "../config/supabase.js";
import { z } from "zod";
import bcrypt from "bcryptjs";

// ========================================================
// VALIDAÇÃO ZOD
// ========================================================
const pessoaSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  email: z.string().email("Email inválido").optional().nullable(),
  telefone: z.string().optional().nullable(),
  role: z.enum(["user", "admin"]).optional(),
});

const updateSchema = pessoaSchema.partial();

const passwordSchema = z.object({
  password: z.string().min(6, "Senha muito curta"),
});

// ========================================================
// LISTAR TODAS AS PESSOAS
// ========================================================
export async function listarPessoas(req, res) {
  try {
    const { data, error } = await supabase
      .from("pessoas")
      .select("id, nome, email, telefone, role, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR PESSOAS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ========================================================
// BUSCAR CADASTRO 
// ========================================================
export async function buscarCadastro(req, res) {
  try {
    const { data, error } = await supabase
      .from("cadastro")
      .select("id, nome_completo_esposo")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR PESSOAS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}


// ========================================================
// BUSCAR PESSOA POR ID
// ========================================================
export async function buscarPessoa(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("pessoas")
      .select("id, nome, email, telefone, role, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Pessoa não encontrada." });

    return res.json({ data });
  } catch (err) {
    console.error("BUSCAR PESSOA ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ========================================================
// CRIAR PESSOA
// ========================================================
export async function criarPessoa(req, res) {
  try {
    const parsed = pessoaSchema.parse(req.body);

    // Evitar emails duplicados
    if (parsed.email) {
      const { data: existente } = await supabase
        .from("pessoas")
        .select("id")
        .eq("email", parsed.email)
        .maybeSingle();

      if (existente)
        return res.status(400).json({ error: "Email já cadastrado." });
    }

    const { data, error } = await supabase
      .from("pessoas")
      .insert(parsed)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Pessoa criada com sucesso",
      data,
    });

  } catch (err) {
    console.error("CRIAR PESSOA ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ========================================================
// ATUALIZAR PESSOA
// ========================================================
export async function atualizarPessoa(req, res) {
  try {
    const { id } = req.params;

    const parsed = updateSchema.parse(req.body);

    // Checar duplicidade de email, se enviado
    if (parsed.email) {
      const { data: existente } = await supabase
        .from("pessoas")
        .select("id")
        .eq("email", parsed.email)
        .neq("id", id)
        .maybeSingle();

      if (existente)
        return res.status(400).json({ error: "Email já está em uso." });
    }

    const { data, error } = await supabase
      .from("pessoas")
      .update(parsed)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      message: "Pessoa atualizada com sucesso",
      data,
    });

  } catch (err) {
    console.error("ATUALIZAR PESSOA ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ========================================================
// ATUALIZAR SENHA COM SEGURANÇA
// ========================================================
export async function atualizarSenha(req, res) {
  try {
    const { id } = req.params;

    const parsed = passwordSchema.parse(req.body);

    const password_hash = await bcrypt.hash(parsed.password, 10);

    const { data, error } = await supabase
      .from("pessoas")
      .update({ password_hash })
      .eq("id", id)
      .select("id, nome, email")
      .single();

    if (error) throw error;

    return res.json({
      message: "Senha atualizada com sucesso",
      data,
    });
  } catch (err) {
    console.error("ATUALIZAR SENHA ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ========================================================
// DELETAR PESSOA (apenas admin)
// ========================================================
export async function deletarPessoa(req, res) {
  try {
    const { id } = req.params;

    // 🔒 REGRA DE NEGÓCIO: verificar vínculo
    const { data: vinculo, error: vinculoError } = await supabase
      .from("teamrole")
      .select("id")
      .eq("pessoa_id", id)
      .limit(1);

    if (vinculoError) throw vinculoError;

    if (vinculo.length > 0) {
      return res.status(409).json({
        error: "Não é possível excluir este encontreiro pois ele está vinculado a uma equipe ou evento."
      });
    }

    // 🗑️ Exclusão segura
    const { error } = await supabase
      .from("pessoas")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({ message: "Pessoa removida com sucesso" });

  } catch (err) {
    console.error("DELETAR PESSOA ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}