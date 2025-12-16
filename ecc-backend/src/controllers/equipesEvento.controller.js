import supabase from "../config/supabase.js";
import { z } from "zod";

// ========================================================
// VALIDAÇÃO
// ========================================================
const vinculoSchema = z.object({
  equipe_id: z.string().uuid("equipe_id inválido"),
  evento_id: z.string().uuid("evento_id inválido"),
});

// ========================================================
// LISTAR TODOS
// ========================================================
export async function listarVinculos(req, res) {
  try {
    const { data, error } = await supabase
      .from("equipes_evento")
      .select(`
        id,
        equipe:equipe_id (id, nome),
        evento:evento_id (id, nome, start_date)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ data });

  } catch (err) {
    console.error("LISTAR EQUIPES_EVENTO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ========================================================
// LISTAR POR EVENTO
// ========================================================
export async function listarPorEvento(req, res) {
  try {
    const { eventoId } = req.params;

    const { data, error } = await supabase
      .from("equipes_evento")
      .select(`
        id,
        equipe:equipe_id (id, nome),
        evento:evento_id (id, nome, capacity)
      `)
      .eq("evento_id", eventoId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return res.json({ data });

  } catch (err) {
    console.error("LISTAR POR EVENTO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}


// ========================================================
// LISTAR POR EQUIPE
// ========================================================
export async function listarPorEquipe(req, res) {
  try {
    const { equipeId } = req.params;

    const { data, error } = await supabase
      .from("equipes_evento")
      .select(`
        id,
        equipe:equipe_id (id, nome),
        evento:evento_id (id, nome, start_date)
      `)
      .eq("equipe_id", equipeId);

    if (error) throw error;

    return res.json({ data });

  } catch (err) {
    console.error("LISTAR POR EQUIPE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ========================================================
// CRIAR VÍNCULO
// ========================================================
export async function criarVinculo(req, res) {
  try {
    const parsed = vinculoSchema.parse(req.body);

    // Evitar duplicidade de vinculo
    const { data: existente } = await supabase
      .from("equipes_evento")
      .select("id")
      .eq("equipe_id", parsed.equipe_id)
      .eq("evento_id", parsed.evento_id)
      .maybeSingle();

    if (existente)
      return res.status(400).json({
        error: "Esta equipe já está vinculada a este evento."
      });

    const { data, error } = await supabase
      .from("equipes_evento")
      .insert(parsed)
      .select(`
        id,
        equipe:equipe_id (id, nome),
        evento:evento_id (id, nome)
      `)
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Vínculo criado com sucesso",
      data
    });

  } catch (err) {
    console.error("CRIAR VINCULO ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ========================================================
// DELETAR VÍNCULO
// ========================================================
export async function deletarVinculo(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("equipes_evento")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({ message: "Vínculo removido com sucesso" });

  } catch (err) {
    console.error("DELETAR VINCULO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
