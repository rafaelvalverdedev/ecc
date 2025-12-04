import supabase from "../config/supabase.js";

// Criar momento
export async function criarMomento(req, res) {
  try {
    const { evento_id, equipe_id, titulo, descricao, start_time, end_time, ordem, previous_step_id } = req.body;
    if (!evento_id || !titulo) return res.status(400).json({ error: "evento_id e titulo são obrigatórios" });

    const { data, error } = await supabase
      .from("momentos_do_evento")
      .insert([{ evento_id, equipe_id, titulo, descricao, start_time, end_time, ordem, previous_step_id }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao criar momento" });
  }
}

// Listar momentos por evento
export async function listarMomentosPorEvento(req, res) {
  try {
    const { evento_id } = req.params;
    const { data, error } = await supabase
      .from("momentos_do_evento")
      .select(`
        id,
        titulo,
        descricao,
        start_time,
        end_time,
        ordem,
        equipe:equipes ( id, nome )
      `)
      .eq("evento_id", evento_id)
      .order("ordem", { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao listar momentos" });
  }
}

// Buscar por id, atualizar, deletar (opcionais)
export async function buscarMomentoPorId(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("momentos_do_evento")
      .select(`id, titulo, descricao, start_time, end_time, ordem, equipe:equipes ( id, nome )`)
      .eq("id", id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Momento não encontrado" });
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao buscar momento" });
  }
}

export async function deletarMomento(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("momentos_do_evento").delete().eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: "Momento deletado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao deletar momento" });
  }
}
