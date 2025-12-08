import supabase from "../config/supabase.js";
import { z } from "zod";

// ===============================
// VALIDAÇÃO COM ZOD
// ===============================
const inscricaoSchema = z.object({
  pessoa_id: z.string().uuid("pessoa_id inválido"),
  evento_id: z.string().uuid("evento_id inválido"),
  tipo: z.enum(["encontrista", "encontreiro"]).default("encontrista"),
  valor: z.number().optional(),
  paid_by_pessoa_id: z.string().uuid().optional().nullable()
});

const updateSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  tipo: z.enum(["encontrista", "encontreiro"]).optional(),
  valor: z.number().optional(),
  paid_by_pessoa_id: z.string().uuid().optional().nullable()
});

// ===============================
// LISTAR TODAS AS INSCRIÇÕES
// ===============================
export async function listarInscricoes(req, res) {
  try {
    const { data, error } = await supabase
      .from("inscricoes")
      .select(`
        id,
        status,
        tipo,
        valor,
        created_at,
        pessoa:pessoa_id (id, nome, email),
        evento:evento_id (id, nome, start_date)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR INSCRICOES ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// LISTAR POR EVENTO
// ===============================
export async function listarPorEvento(req, res) {
  try {
    const { eventoId } = req.params;

    const { data, error } = await supabase
      .from("inscricoes")
      .select(`
        id,
        status,
        tipo,
        valor,
        pessoa:pessoa_id (id, nome),
        created_at
      `)
      .eq("evento_id", eventoId);

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR POR EVENTO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// LISTAR POR PESSOA
// ===============================
export async function listarPorPessoa(req, res) {
  try {
    const { pessoaId } = req.params;

    const { data, error } = await supabase
      .from("inscricoes")
      .select(`
        id,
        status,
        tipo,
        valor,
        evento:evento_id (id, nome, start_date),
        created_at
      `)
      .eq("pessoa_id", pessoaId);

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR POR PESSOA ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// BUSCAR INSCRIÇÃO POR ID
// ===============================
export async function buscarInscricao(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("inscricoes")
      .select(`
        id,
        status,
        tipo,
        valor,
        pessoa:pessoa_id (id, nome, email),
        evento:evento_id (id, nome, start_date),
        created_at
      `)
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Inscrição não encontrada" });

    return res.json({ data });
  } catch (err) {
    console.error("BUSCAR INSCRICAO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// CRIAR INSCRIÇÃO
// ===============================
export async function criarInscricao(req, res) {
  try {
    const parsed = inscricaoSchema.parse(req.body);

    // Verificar duplicidade (1 por evento)
    const { data: existente } = await supabase
      .from("inscricoes")
      .select("id")
      .eq("pessoa_id", parsed.pessoa_id)
      .eq("evento_id", parsed.evento_id)
      .maybeSingle();

    if (existente)
      return res.status(400).json({
        error: "Esta pessoa já possui inscrição neste evento."
      });

    const toInsert = {
      ...parsed,
      status: "pending",
      valor: parsed.valor ?? 0
    };

    const { data, error } = await supabase
      .from("inscricoes")
      .insert(toInsert)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Inscrição criada com sucesso",
      data
    });
  } catch (err) {
    console.error("CRIAR INSCRICAO ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ===============================
// ATUALIZAR INSCRIÇÃO
// ===============================
export async function atualizarInscricao(req, res) {
  try {
    const { id } = req.params;
    const parsed = updateSchema.parse(req.body);

    const { data, error } = await supabase
      .from("inscricoes")
      .update(parsed)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      message: "Inscrição atualizada com sucesso",
      data
    });
  } catch (err) {
    console.error("ATUALIZAR INSCRICAO ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ===============================
// CANCELAR INSCRIÇÃO
// ===============================
export async function cancelarInscricao(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("inscricoes")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      message: "Inscrição cancelada",
      data
    });
  } catch (err) {
    console.error("CANCELAR INSCRICAO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// DELETAR (ADMIN)
// ===============================
export async function deletarInscricao(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("inscricoes")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({ message: "Inscrição removida com sucesso" });
  } catch (err) {
    console.error("DELETAR INSCRICAO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getInscricaoPublica(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("inscricoes")
      .select("id, status, evento_id, pessoa_id")
      .eq("id", id)
      .single();

    if (error) throw error;

    return res.json(data);

  } catch (err) {
    console.log("Erro getInscricaoPublica:", err);
    return res.status(404).json({ error: "Inscrição não encontrada" });
  }
}

export const obterInscricaoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await db
      .from("inscricoes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Inscrição não encontrada" });

    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar inscrição:", err);
    res.status(500).json({ error: "Erro interno ao buscar inscrição" });
  }
};


/**
 * ❗ ROTA PÚBLICA — usada pelo FRONT para acompanhar o pagamento
 * GET /inscricoes/:id/status
 * Não exige token!
 */
export const verificarStatusInscricao = async (req, res) => {
 try {
    const { id } = req.params;

    // 🔍 Busca inscrição no Supabase
    const { data, error } = await supabase
      .from("inscricoes")
      .select("status, pagamento_id, id")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Inscrição não encontrada" });
    }

    return res.json({
      inscricao_id: data.id,
      status: data.status,
      pagamento_id: data.pagamento_id,
    });

  } catch (err) {
    console.error("Erro ao verificar status:", err);
    return res.status(500).json({ error: "Erro ao verificar status" });
  }
};