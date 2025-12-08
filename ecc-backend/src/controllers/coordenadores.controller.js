import supabase from "../config/supabase.js";
import { z } from "zod";

// ========================================================
// VALIDAÇÃO
// ========================================================
const promoteSchema = z.object({
  pessoa_id: z.string().uuid("pessoa_id inválido")
});

// ========================================================
// LISTAR COORDENADORES DO SISTEMA (role = admin)
// ========================================================
export async function listarCoordenadores(req, res) {
  try {
    const { data, error } = await supabase
      .from("pessoas")
      .select("id, nome, email, telefone, role")
      .eq("role", "admin")
      .order("nome");

    if (error) throw error;

    return res.json({ data });

  } catch (err) {
    console.error("LISTAR COORDENADORES ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ========================================================
// PROMOVER PESSOA A COORDENADOR
// ========================================================
export async function promoverCoordenador(req, res) {
  try {
    const parsed = promoteSchema.parse(req.body);

    const { data, error } = await supabase
      .from("pessoas")
      .update({ role: "admin" })
      .eq("id", parsed.pessoa_id)
      .select("id, nome, email, role")
      .single();

    if (error) throw error;

    return res.json({
      message: "Pessoa promovida a coordenador",
      data
    });

  } catch (err) {
    console.error("PROMOVER COORDENADOR ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ========================================================
// REMOVER PAPEL DE COORDENADOR
// ========================================================
export async function removerCoordenador(req, res) {
  try {
    const { pessoaId } = req.params;

    const { data, error } = await supabase
      .from("pessoas")
      .update({ role: "user" })
      .eq("id", pessoaId)
      .select("id, nome, email, role")
      .single();

    if (error) throw error;

    return res.json({
      message: "Coordenador removido com sucesso",
      data
    });

  } catch (err) {
    console.error("REMOVER COORDENADOR ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ========================================================
// LISTAR LÍDERES DE EQUIPES (teamrole: is_leader = true)
// ========================================================
export async function listarLideres(req, res) {
  try {
    const { eventoId } = req.params;

    const { data, error } = await supabase
      .from("teamrole")
      .select(`
        id,
        pessoa:pessoa_id (id, nome, email),
        equipe:equipe_id (id, nome),
        is_leader
      `)
      .eq("evento_id", eventoId)
      .eq("is_leader", true);

    if (error) throw error;

    return res.json({ data });

  } catch (err) {
    console.error("LISTAR LIDERES ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
