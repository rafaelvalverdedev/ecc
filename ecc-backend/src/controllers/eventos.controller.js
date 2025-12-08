import supabase from "../config/supabase.js";
import { z } from "zod";

// ===============================
// SCHEMA DE VALIDAÇÃO
// ===============================
const eventoSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  descricao: z.string().optional(),
  local: z.string().min(3, "Local obrigatório"),
  start_date: z.string().refine(v => !isNaN(Date.parse(v)), "Data inicial inválida"),
  end_date: z.string().optional(),
  capacity: z.number().optional()
});

// ===============================
// LISTAR EVENTOS
// ===============================
export async function listarEventos(req, res) {
  try {
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR EVENTOS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// BUSCAR EVENTO POR ID
// ===============================
export async function buscarEvento(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: "Evento não encontrado" });

    return res.json({ data });
  } catch (err) {
    console.error("BUSCAR EVENTO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// CRIAR EVENTO
// ===============================
export async function criarEvento(req, res) {
  try {
    const parsed = eventoSchema.parse(req.body);

    // nome deve ser único
    const { data: existente } = await supabase
      .from("eventos")
      .select("id")
      .eq("nome", parsed.nome)
      .maybeSingle();

    if (existente)
      return res.status(400).json({ error: "Já existe um evento com este nome" });

    const { data, error } = await supabase
      .from("eventos")
      .insert(parsed)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Evento criado com sucesso",
      data
    });
  } catch (err) {
    console.error("CRIAR EVENTO ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ===============================
// ATUALIZAR EVENTO
// ===============================
export async function atualizarEvento(req, res) {
  try {
    const { id } = req.params;
    const parsed = eventoSchema.partial().parse(req.body);

    const { data, error } = await supabase
      .from("eventos")
      .update(parsed)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.json({
      message: "Evento atualizado com sucesso",
      data
    });
  } catch (err) {
    console.error("ATUALIZAR EVENTO ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ===============================
// DELETAR EVENTO
// ===============================
export async function deletarEvento(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("eventos")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    return res.json({ message: "Evento removido com sucesso" });

  } catch (err) {
    console.error("DELETAR EVENTO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
