import supabase from "../config/supabase.js";
import { z } from "zod";

// ===============================
// VALIDAÇÃO
// ===============================
const teamRoleSchema = z.object({
  pessoa_id: z.string().uuid("pessoa_id inválido"),
  equipe_id: z.string().uuid("equipe_id inválido"),
  evento_id: z.string().uuid("evento_id inválido"),
  is_leader: z.boolean().optional(),
  pagou: z.boolean().optional(),
});

// ===============================
// LISTAR TODOS OS VÍNCULOS
// ===============================
export async function listarTeamRoles(req, res) {
  try {
    const { data, error } = await supabase
      .from("teamrole")
      .select(`
        id,
        is_leader,
        pagou,
        pessoa:pessoa_id (id, nome, email),
        equipe:equipe_id (id, nome),
        evento:evento_id (id, nome)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR TEAMROLE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// LISTAR POR PESSOA
// ===============================
export async function listarPorPessoa(req, res) {
  try {
    const { pessoaId } = req.params;

    const { data, error } = await supabase
      .from("teamrole")
      .select(`
        id,
        is_leader,
        pagou,
        equipe:equipe_id (id, nome),
        evento:evento_id (id, nome)
      `)
      .eq("pessoa_id", pessoaId);

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR POR PESSOA ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// LISTAR POR EQUIPE
// ===============================
export async function listarPorEquipe(req, res) {
  try {
    const { equipeId } = req.params;

    const { data, error } = await supabase
      .from("teamrole")
      .select(`
        id,
        is_leader,
        pagou,
        pessoa:pessoa_id (id, nome, email),
        evento:evento_id (id, nome)
      `)
      .eq("equipe_id", equipeId);

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR POR EQUIPE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// LISTAR POR EVENTO
// ===============================
export async function listarPorEvento(req, res) {
  try {
    const { eventoId } = req.params;

    const { data, error } = await supabase
      .from("teamrole")
      .select(`
        id,
        is_leader,
        pagou,
        pessoa:pessoa_id (id, nome),
        equipe:equipe_id (id, nome)
      `)
      .eq("evento_id", eventoId);

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR POR EVENTO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===============================
// CRIAR VÍNCULO
// ===============================
export async function criarTeamRole(req, res) {
  try {
    const parsed = teamRoleSchema.parse(req.body);

    // Verificar duplicidade
    const { data: existente } = await supabase
      .from("teamrole")
      .select("id")
      .eq("pessoa_id", parsed.pessoa_id)
      .eq("equipe_id", parsed.equipe_id)
      .eq("evento_id", parsed.evento_id)
      .maybeSingle();

    if (existente)
      return res.status(400).json({ error: "Esta pessoa já está vinculada a esta equipe neste evento." });

    const { data, error } = await supabase
      .from("teamrole")
      .insert(parsed)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Vínculo criado com sucesso",
      data,
    });

  } catch (err) {
    console.error("CRIAR TEAMROLE ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ===============================
// ATUALIZAR VÍNCULO
// ===============================
export async function atualizarTeamRole(req, res) {
  try {
    const { id } = req.params;

    const parsed = teamRoleSchema.partial().parse(req.body);

    const { data, error } = await supabase
      .from("teamrole")
      .update(parsed)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      message: "Vínculo atualizado com sucesso",
      data,
    });

  } catch (err) {
    console.error("ATUALIZAR TEAMROLE ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ===============================
// DELETAR VÍNCULO
// ===============================
export async function deletarTeamRole(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("teamrole")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({ message: "Vínculo removido com sucesso" });

  } catch (err) {
    console.error("DELETAR TEAMROLE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}


// ===============================
// ELISTAR TEALROLE PODE ID
// ===============================
export async function listarTeamrolePorId(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("teamrole")
      .select(`
        id,
        is_leader,
        pagou,
        pessoa:pessoa_id(id, nome, email),
        equipe:equipe_id(id, nome),
        evento:evento_id(id, nome)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    if (!data) return res.status(404).json({ error: "Teamrole não encontrado" });

    return res.json({ data });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar vínculo" });
  }
}