import supabase from "../config/supabase.js";
import z from "zod";

export const encontristaInscricaoSchema = z.object({
  // Esposo
  nome_completo_esposo: z.string().min(1),
  data_nascimento_esposo: z.string().min(1),
  profissao_esposo: z.string().optional().nullable(),
  como_chamar_esposo: z.string().optional().nullable(),
  igreja_esposo: z.string().optional().nullable(),
  local_trabalho_esposo: z.string().optional().nullable(),
  celular_esposo: z.string().optional().nullable(),
  instagram_esposo: z.string().optional().nullable(),
  restricoes_alimentares_esposo: z.string().optional().nullable(),
  medicamentos_alergias_esposo: z.string().optional().nullable(),
  religiao_esposo: z.string().optional().nullable(),
  escolaridade_esposo: z.string().optional().nullable(),

  // Esposa
  nome_completo_esposa: z.string().min(1),
  data_nascimento_esposa: z.string().min(1),
  profissao_esposa: z.string().optional().nullable(),
  como_chamar_esposa: z.string().optional().nullable(),
  igreja_esposa: z.string().optional().nullable(),
  local_trabalho_esposa: z.string().optional().nullable(),
  celular_esposa: z.string().optional().nullable(),
  instagram_esposa: z.string().optional().nullable(),
  restricoes_alimentares_esposa: z.string().optional().nullable(),
  medicamentos_alergias_esposa: z.string().optional().nullable(),
  religiao_esposa: z.string().optional().nullable(),
  escolaridade_esposa: z.string().optional().nullable(),

  // Casal
  endereco: z.string().optional().nullable(),
  numero: z.string().optional().nullable(),
  complemento: z.string().optional().nullable(),
  bairro: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  uf: z.string().optional().nullable(),
  cep: z.string().optional().nullable(),
  data_casamento: z.string().optional().nullable(),
  telefone_principal: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  possui_filhos: z.boolean().optional(),
  quantidade_filhos: z.number().optional().nullable(),

  nome_responsavel_filhos: z.string().optional().nullable(),
  telefone_responsavel: z.string().optional().nullable(),

  casal_que_convidou: z.string().optional().nullable(),
  telefone_casal_que_convidou: z.string().optional().nullable(),
});



// =========================
// Criar Inscrição
// =========================
export async function criarEncontristaInscricao(req, res) {
  const parsed = encontristaInscricaoSchema.safeParse(req.body);

  if (!parsed.success) {
    const firstError =
      parsed.error?.issues?.[0]?.message || "Dados inválidos";

    return res.status(400).json({ error: firstError });
  }

  const payload = parsed.data;

  try {
    const { data, error } = await supabase
      .from("encontrista_inscricao")
      .insert([payload])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao criar inscrição" });
  }
}

// =========================
// Listar Todas
// =========================
export async function listarEncontristaInscricoes(req, res) {
  try {
    const { data, error } = await supabase
      .from("encontrista_inscricao")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao listar inscrições" });
  }
}

// =========================
// Buscar por ID
// =========================
export async function buscarEncontristaInscricao(req, res) {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("encontrista_inscricao")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Inscrição não encontrada" });

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao buscar inscrição" });
  }
}

// =========================
// Atualizar inscrição
// =========================
export async function atualizarEncontristaInscricao(req, res) {
  const { id } = req.params;

  const parsed = encontristaInscricaoSchema.partial().safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const updateData = parsed.data;

  try {
    const { data, error } = await supabase
      .from("encontrista_inscricao")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.json(data);

  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar inscrição" });
  }
}

// =========================
// Deletar inscrição
// =========================
export async function deletarEncontristaInscricao(req, res) {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("encontrista_inscricao")
      .delete()
      .eq("id", id);

    if (error)
      return res.status(400).json({ error: "Erro ao excluir inscrição" });

    return res.json({ message: "Inscrição excluída com sucesso" });

  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao excluir inscrição" });
  }
}
