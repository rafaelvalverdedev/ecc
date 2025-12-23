import supabase from "../config/supabase.js";


// ========================================================
// LISTAR TODAS AS PESSOAS
// ========================================================
export async function rotaA(req, res) {
//  const { eventoId } = req.params;

    const eventoId = "34ad59ee-7086-4c57-803c-68b9be2c8d59";
  try {
    const { data, error } = await supabase
      .from("cadastro")
      .select(`
        *,
        teamrole!inner (
          *,
          equipes!inner (
            *,
            equipes_evento!inner (
              *,
              eventos!inner (
                *
              )
            )
          )
        )
      `)
      .eq("teamrole.equipes.equipes_evento.evento_id", eventoId);

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("PESSOAS DO EVENTO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}