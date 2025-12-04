import supabase from "../config/supabase.js";
import z from 'zod';

// ESQUEMA ZOD PARA VALIDAR PESSOAS
const pessoaSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Email inválido").optional().nullable(),
  telefone: z.string().optional().nullable(),
});

// Criar pessoa
export async function criarPessoa(req, res) {
  // VALIDAÇÃO ZOD (fora do try/catch)
  const parsed = pessoaSchema.safeParse(req.body);

  if (!parsed.success) {
    const firstError =
      parsed.error?.issues?.[0]?.message ||
      parsed.error?.errors?.[0]?.message ||
      "Dados inválidos";

    return res.status(400).json({ error: firstError });
  }

  const { nome, email, telefone } = parsed.data;

  try {
    const { data, error } = await supabase
      .from('pessoas')
      .insert([{ nome, email, telefone }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao criar pessoa" });
  }
}

// Listar pessoas
export async function listarPessoas(req, res) {
  try {
    const { data, error } = await supabase.from("pessoas").select("*");
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao listar pessoas" });
  }
}

// Buscar pessoa por id
export async function buscarPessoaPorId(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("pessoas").select("*").eq("id", id).single();
    if (error || !data) return res.status(404).json({ error: "Pessoa não encontrada" });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao buscar pessoa" });
  }
}

// Atualizar pessoa
export async function atualizarPessoa(req, res) {
  const { id } = req.params;

  // VALIDAÇÃO PARCIAL (Zod .partial())
  const parsed = pessoaSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    const errorMessage = parsed.error.errors[0].message;
    return res.status(400).json({ error: errorMessage });
  }

  const updateData = parsed.data;

  const { data, error } = await supabase
    .from('pessoas')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  return res.json(data);
}

// Deletar pessoa
export async function deletarPessoa(req, res) {
  const { id } = req.params;

  const { error } = await supabase.from('pessoas').delete().eq('id', id);

  if (error) {
    return res.status(400).json({ error: "Erro ao excluir pessoa (verifique vínculos)" });
  }
  return res.json({ message: "Pessoa excluída com sucesso" });
}
