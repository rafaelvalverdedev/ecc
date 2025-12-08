import supabase from "../config/supabase.js";
import { z } from "zod";

// ===============================
// SCHEMA DE VALIDAÇÃO
// ===============================
const equipeSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  descricao: z.string().optional(),
});

// ===============================
// LISTAR EQUIPES
// ===============================
export async function listarEquipes(req, res) {
  try {
    const { data, error } = await supabase
      .from("equipes")
      .select("*")
      .order("nome", { ascending: true });

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR EQUIPES ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// BUSCAR EQUIPE POR ID
// ===============================
export async function buscarEquipe(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("equipes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Equipe não encontrada" });

    return res.json({ data });
  } catch (err) {
    console.error("BUSCAR EQUIPE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// CRIAR EQUIPE
// ===============================
export async function criarEquipe(req, res) {
  try {
    const parsed = equipeSchema.parse(req.body);

    // Garantir nome único
    const { data: existente } = await supabase
      .from("equipes")
      .select("id")
      .eq("nome", parsed.nome)
      .maybeSingle();

    if (existente)
      return res.status(400).json({ error: "Nome de equipe já existe." });

    const { data, error } = await supabase
      .from("equipes")
      .insert(parsed)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Equipe criada com sucesso",
      data,
    });
  } catch (err) {
    console.error("CRIAR EQUIPE ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ===============================
// ATUALIZAR EQUIPE
// ===============================
export async function atualizarEquipe(req, res) {
  try {
    const { id } = req.params;

    const parsed = equipeSchema.partial().parse(req.body);

    const { data, error } = await supabase
      .from("equipes")
      .update(parsed)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.json({
      message: "Equipe atualizada com sucesso",
      data,
    });
  } catch (err) {
    console.error("ATUALIZAR EQUIPE ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ===============================
// DELETAR EQUIPE
// ===============================
export async function deletarEquipe(req, res) {
  try {
    const { id } = req.params;

    // Validar se equipe existe
    const { data: existente } = await supabase
      .from("equipes")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existente)
      return res.status(404).json({ error: "Equipe não encontrada" });

    // Excluir equipe
    const { error } = await supabase
      .from("equipes")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    return res.json({ message: "Equipe removida com sucesso" });
  } catch (err) {
    console.error("DELETAR EQUIPE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
