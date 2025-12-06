import supabase from "../config/supabase.js";

// Criar evento
export async function criarEvento(req, res) {
  try {
    const { nome, descricao, local, start_date, end_date, capacity } = req.body;

    if (!nome || !start_date || !local) {
      return res.status(400).json({ error: "Os campos 'nome', 'local' e 'start_date' são obrigatórios" });
    }

    if (end_date && end_date < start_date) {
      return res.status(400).json({ error: "A data final não pode ser menor que a data inicial" });
    }

    const { data, error } = await supabase
      .from("eventos")
      .insert([{ nome, descricao, local, start_date, end_date, capacity }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao criar evento" });
  }
}

// Listar eventos (com momentos, equipes, contadores)
export async function listarEventos(req, res) {
  try {
    const { data, error } = await supabase
      .from("eventos")
      .select(`
        id,
        nome,
        descricao,
        local,
        start_date,
        end_date,
        capacity,
        created_at,
        updated_at,
        momentos_do_evento (
          id,
          titulo,
          start_time,
          end_time,
          equipe:equipes ( id, nome )
        ),
        inscricoes ( id, status )
      `)
      .order("start_date", { ascending: true });

    if (error) return res.status(400).json({ error: error.message });

    const eventosFormatados = data.map(evento => ({
      ...evento,
      total_momentos: evento.momentos_do_evento ? evento.momentos_do_evento.length : 0,
      total_inscricoes: evento.inscricoes ? evento.inscricoes.length : 0
    }));

    return res.status(200).json(eventosFormatados);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar eventos" });
  }
}

// Buscar evento por id (com detalhes)
export async function buscarEventoPorId(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("eventos")
      .select(`
        id,
        nome,
        descricao,
        local,
        start_date,
        end_date,
        capacity,
        created_at,
        updated_at,
        momentos_do_evento (
          id,
          titulo,
          descricao,
          start_time,
          end_time,
          ordem,
          equipe:equipes ( id, nome, descricao )
        ),
        inscricoes (
          id,
          pessoa_id,
          status,
          created_at
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Evento não encontrado" });

    const total_inscricoes = data.inscricoes ? data.inscricoes.length : 0;
    const eventoFormatado = {
      ...data,
      total_inscricoes,
      vagas_restantes: data.capacity ? data.capacity - total_inscricoes : null,
      lotado: data.capacity ? total_inscricoes >= data.capacity : false
    };

    return res.status(200).json(eventoFormatado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar evento completo" });
  }
}

// Atualizar evento
export async function atualizarEvento(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao, local, start_date, end_date, capacity } = req.body;

    if (!nome && !descricao && !local && !start_date && !end_date && !capacity) {
      return res.status(400).json({ error: "Informe ao menos um campo para atualização" });
    }

    if (start_date && end_date && end_date < start_date) {
      return res.status(400).json({ error: "A data final não pode ser menor que a data inicial" });
    }

    const { data, error } = await supabase
      .from("eventos")
      .update({ nome, descricao, local, start_date, end_date, capacity })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ error: "Evento não encontrado" });
    return res.status(200).json({ message: "Evento atualizado com sucesso", data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao atualizar evento" });
  }
}

// Deletar evento
export async function deletarEvento(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: "Evento deletado com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao deletar evento" });
  }
}

export async function listarEquipesDoEvento(req, res) {
  try {
    const { id } = req.params;

    // 1) Buscar vínculos evento → equipe
    const { data: vinculos, error: errorVinculo } = await supabase
      .from("equipes_evento")
      .select("equipe_id")
      .eq("evento_id", id);

    if (errorVinculo)
      return res.status(400).json({ error: errorVinculo.message });

    if (!vinculos || vinculos.length === 0)
      return res.json([]); // evento sem equipes vinculadas

    const equipeIds = vinculos.map(v => v.equipe_id);

    // 2) Buscar dados das equipes vinculadas
    const { data: equipes, error: errorEquipe } = await supabase
      .from("equipes")
      .select("id, nome")
      .in("id", equipeIds);

    if (errorEquipe)
      return res.status(400).json({ error: errorEquipe.message });

    return res.json(equipes);

  } catch (err) {
    console.error("Erro ao listar equipes do evento:", err);
    return res.status(500).json({ error: "Erro interno ao listar equipes do evento" });
  }
}
