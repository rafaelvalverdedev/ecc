import supabase from "../config/supabase.js";

// ---------------------------------------------------------------
//  Criar relação equipe–evento
// ---------------------------------------------------------------
export async function criarEquipeEvento(req, res) {
  try {
    const { evento_id, equipe_id } = req.body;

    if (!evento_id || !equipe_id) {
      return res
        .status(400)
        .json({ error: "Os campos evento_id e equipe_id são obrigatórios" });
    }

    // 1️⃣ Verifica se evento existe
    const { data: evento, error: eventoErr } = await supabase
      .from("eventos")
      .select("id")
      .eq("id", evento_id)
      .single();

    if (eventoErr || !evento) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    // 2️⃣ Verifica se equipe existe
    const { data: equipe, error: equipeErr } = await supabase
      .from("equipes")
      .select("id")
      .eq("id", equipe_id)
      .single();

    if (equipeErr || !equipe) {
      return res.status(404).json({ error: "Equipe não encontrada" });
    }

    // 3️⃣ Verifica duplicidade (índice unique impede, mas validamos antes)
    const { data: exists } = await supabase
      .from("equipes_evento")
      .select("id")
      .eq("evento_id", evento_id)
      .eq("equipe_id", equipe_id)
      .maybeSingle();

    if (exists) {
      return res
        .status(400)
        .json({ error: "Esta equipe já está vinculada a este evento" });
    }

    // 4️⃣ Inserção
    const { data, error } = await supabase
      .from("equipes_evento")
      .insert([{ evento_id, equipe_id }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ message: "Equipe vinculada ao evento!", data });
  } catch (err) {
    console.error("Erro interno:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}

// ---------------------------------------------------------------
//  Listar todas as equipes vinculadas a eventos
// ---------------------------------------------------------------
export async function listarEquipesEvento(req, res) {
  try {
    const { data, error } = await supabase
      .from("equipes_evento")
      .select(`
        id,
        evento:evento_id ( id, nome ),
        equipe:equipe_id ( id, nome )
      `);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro:", err);
    return res.status(500).json({ error: "Erro interno ao listar equipes_evento" });
  }
}

// ---------------------------------------------------------------
//  Buscar relação por ID
// ---------------------------------------------------------------
export async function buscarEquipeEventoPorId(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("equipes_evento")
      .select(`
        id,
        evento:evento_id ( id, nome ),
        equipe:equipe_id ( id, nome )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Vínculo equipe-evento não encontrado" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro:", err);
    return res.status(500).json({ error: "Erro interno ao buscar vínculo" });
  }
}

// ---------------------------------------------------------------
//  Remover vínculo equipe–evento
// ---------------------------------------------------------------
export async function deletarEquipeEvento(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("equipes_evento")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: "Vínculo removido com sucesso" });
  } catch (err) {
    console.error("Erro:", err);
    return res.status(500).json({ error: "Erro interno ao deletar vínculo" });
  }
}
