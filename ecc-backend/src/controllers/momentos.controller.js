import supabase from "../config/supabase.js";
import { z } from "zod";

// ========================================================
// VALIDAÇÃO ZOD
// ========================================================
const momentoSchema = z.object({
  evento_id: z.string().uuid("evento_id inválido"),
  equipe_id: z.string().uuid("equipe_id inválido").optional().nullable(),
  titulo: z.string().min(3, "Título muito curto"),
  descricao: z.string().optional().nullable(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  ordem: z.number().optional(),
  previous_step_id: z.string().uuid().optional().nullable()
});

const updateSchema = momentoSchema.partial();

// ========================================================
// LISTAR TODOS OS MOMENTOS
// ========================================================
export async function listarMomentos(req, res) {
  try {
    const { data, error } = await supabase
      .from("momentos_do_evento")
      .select(`
        id,
        titulo,
        descricao,
        start_time,
        end_time,
        ordem,
        previous_step_id,
        evento:evento_id (id, nome),
        equipe:equipe_id (id, nome)
      `)
      .order("ordem", { ascending: true });

    if (error) throw error;

    return res.json({ data });

  } catch (err) {
    console.error("LISTAR MOMENTOS ERROR:", err);
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
      .from("momentos_do_evento")
      .select(`
        id,
        titulo,
        descricao,
        start_time,
        end_time,
        ordem,
        previous_step_id,
        equipe:equipe_id (id, nome)
      `)
      .eq("evento_id", eventoId)
      .order("ordem", { ascending: true });

    if (error) throw error;

    return res.json({ data });

  } catch (err) {
    console.error("LISTAR POR EVENTO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ========================================================
// BUSCAR MOMENTO POR ID
// ========================================================
export async function buscarMomento(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("momentos_do_evento")
      .select(`
        id,
        titulo,
        descricao,
        start_time,
        end_time,
        ordem,
        previous_step_id,
        evento:evento_id (id, nome),
        equipe:equipe_id (id, nome)
      `)
      .eq("id", id)
      .single();

    if (error)
      return res.status(404).json({ error: "Momento não encontrado." });

    return res.json({ data });

  } catch (err) {
    console.error("BUSCAR MOMENTO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ========================================================
// CRIAR MOMENTO
// ========================================================
export async function criarMomento(req, res) {
  try {
    const parsed = momentoSchema.parse(req.body);

    // Se ordem não vier → pega próximo número automaticamente
    let ordemFinal = parsed.ordem;

    if (!ordemFinal) {
      const { data: max } = await supabase
        .from("momentos_do_evento")
        .select("ordem")
        .eq("evento_id", parsed.evento_id)
        .order("ordem", { ascending: false })
        .maybeSingle();

      ordemFinal = max?.ordem ? max.ordem + 1 : 1;
    }

    const toInsert = { ...parsed, ordem: ordemFinal };

    const { data, error } = await supabase
      .from("momentos_do_evento")
      .insert(toInsert)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Momento criado com sucesso",
      data
    });

  } catch (err) {
    console.error("CRIAR MOMENTO ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ========================================================
// ATUALIZAR MOMENTO
// ========================================================
export async function atualizarMomento(req, res) {
  try {
    const { id } = req.params;

    const parsed = updateSchema.parse(req.body);

    const { data, error } = await supabase
      .from("momentos_do_evento")
      .update(parsed)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      message: "Momento atualizado com sucesso",
      data
    });

  } catch (err) {
    console.error("ATUALIZAR MOMENTO ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ========================================================
// DELETAR MOMENTO
// ========================================================
export async function deletarMomento(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("momentos_do_evento")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({ message: "Momento removido com sucesso" });

  } catch (err) {
    console.error("DELETAR MOMENTO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
