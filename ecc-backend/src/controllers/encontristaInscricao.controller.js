import supabase from "../config/supabase.js";
import { z } from "zod";

// ========================================================
// VALIDAÇÃO DO FORMULÁRIO (ZOD) — ALINHADA AO BANCO
// ========================================================
const encontristaSchema = z.object({
  // esposo
  nome_completo_esposo: z.string().min(3),
  email_esposo: z.string().email(),
  data_nascimento_esposo: z.string().optional().nullable(),
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

  // esposa
  nome_completo_esposa: z.string().min(3),
  email_esposa: z.string().email(),
  data_nascimento_esposa: z.string().optional().nullable(),
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

  // casal
  endereco: z.string().min(3),
  numero: z.string().optional().nullable(),
  complemento: z.string().optional().nullable(),
  bairro: z.string().optional().nullable(),
  cidade: z.string().min(2),
  uf: z.string().length(2),
  cep: z.string().optional().nullable(),

  data_casamento: z.string().optional().nullable(),
  telefone_principal: z.string().optional().nullable(),

  possui_filhos: z.boolean().optional(),
  quantidade_filhos: z.number().optional().nullable(),
  grau_parentesco_outro: z.string().optional().nullable(),
  nome_responsavel_filhos: z.string().optional().nullable(),
  endereco_responsavel: z.string().optional().nullable(),
  numero_responsavel: z.string().optional().nullable(),
  complemento_responsavel: z.string().optional().nullable(),
  bairro_responsavel: z.string().optional().nullable(),
  cidade_responsavel: z.string().optional().nullable(),
  telefone_responsavel: z.string().optional().nullable(),

  casal_que_convidou: z.string().optional().nullable(),
  telefone_casal_que_convidou: z.string().optional().nullable(),
});

// ========================================================
// LISTAR
// ========================================================
export async function listar(req, res) {
  try {
    const { data, error } = await supabase
      .from("encontrista_inscricao")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return res.json({ data });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ========================================================
// BUSCAR POR ID
// ========================================================
export async function buscar(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("encontrista_inscricao")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Registro não encontrado" });
    return res.json({ data });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ========================================================
// CRIAR
// ========================================================
export async function criar(req, res) {
  try {
    const parsed = encontristaSchema.parse(req.body);

    const { data, error } = await supabase
      .from("encontrista_inscricao")
      .insert(parsed)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Inscrição criada com sucesso",
      data
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// ========================================================
// ATUALIZAR
// ========================================================
export async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const parsed = encontristaSchema.partial().parse(req.body);

    const { data, error } = await supabase
      .from("encontrista_inscricao")
      .update(parsed)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      message: "Inscrição atualizada",
      data
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// ========================================================
// DELETAR (ADMIN)
// ========================================================
export async function deletar(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("encontrista_inscricao")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({ message: "Inscrição removida com sucesso" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
