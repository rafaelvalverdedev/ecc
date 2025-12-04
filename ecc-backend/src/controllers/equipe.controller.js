import supabase from "../config/supabase.js";
import { z } from "zod";

// ================================
// ZOD SCHEMAS
// ================================
const equipeSchema = z.object({
  nome: z.string().min(1, "Campo 'nome' é obrigatório"),
  descricao: z.string().optional().nullable(),
});

const equipeUpdateSchema = equipeSchema.partial();


// ================================
// Criar equipe
// ================================
export async function criarEquipe(req, res) {
  const parsed = equipeSchema.safeParse(req.body);

  if (!parsed.success) {
    const firstError =
      parsed.error?.issues?.[0]?.message ||
      "Dados inválidos";

    return res.status(400).json({ error: firstError });
  }

  const { nome, descricao } = parsed.data;

  try {
    const { data, error } = await supabase
      .from("equipes")
      .insert([{ nome, descricao }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json(data);
  } catch (err) {
    console.error("Erro ao criar equipe:", err);
    return res.status(500).json({ error: "Erro interno ao criar equipe" });
  }
}



// ================================
// Listar equipes
// ================================
export async function listarEquipes(req, res) {
  try {
    const { data, error } = await supabase
      .from("equipes")
      .select(`
        id,
        nome,
        descricao,
        created_at,
        updated_at,
        members:teamrole (
          id,
          is_leader,
          pessoa:pessoa_id ( id, nome, email, telefone )
        )
      `);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao listar equipes" });
  }
}



// ================================
// Buscar equipe por ID
// ================================
export async function buscarEquipePorId(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("equipes")
      .select(`
        id,
        nome,
        descricao,
        members:teamrole (
          id,
          is_leader,
          pessoa:pessoa_id ( id, nome, email, telefone )
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Equipe não encontrada" });

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao buscar equipe" });
  }
}



// ================================
// Atualizar equipe
// ================================
export async function atualizarEquipe(req, res) {
  const parsed = equipeUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    const firstError =
      parsed.error?.issues?.[0]?.message ||
      "Dados inválidos";

    return res.status(400).json({ error: firstError });
  }

  const updateData = parsed.data;

  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("equipes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Equipe não encontrada" });

    return res.status(200).json({ message: "Equipe atualizada", data });
  } catch (err) {
    console.error("Erro ao atualizar equipe:", err);
    return res.status(500).json({ error: "Erro interno ao atualizar equipe" });
  }
}



// ================================
// Deletar equipe
// ================================
export async function deletarEquipe(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("equipes")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Equipe deletada" });
  } catch (err) {
    console.error("Erro ao deletar equipe:", err);
    return res.status(500).json({ error: "Erro interno ao deletar equipe" });
  }
}
