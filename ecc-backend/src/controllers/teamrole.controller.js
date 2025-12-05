import supabase from "../config/supabase.js";
import { z } from "zod";


// ======================================================
// 📌 ZOD SCHEMAS
// ======================================================

const teamroleSchema = z.object({
  pessoa_id: z.string().uuid("pessoa_id deve ser um UUID válido"),
  equipe_id: z.string().uuid("equipe_id deve ser um UUID válido"),
  is_leader: z.boolean().optional().default(false),
});


// ======================================================
// 📌 Adicionar membro à equipe
// ======================================================
export async function adicionarTeamrole(req, res) {
  // Validação com Zod
  const parsed = teamroleSchema.safeParse(req.body);

  if (!parsed.success) {
    const errorMessage =
      parsed.error?.issues?.[0]?.message || "Dados inválidos";

    return res.status(400).json({ error: errorMessage });
  }

  const { pessoa_id, equipe_id, is_leader } = parsed.data;

  try {
    // Verificar se pessoa existe
    const { data: pessoa } = await supabase
      .from("pessoas")
      .select("id")
      .eq("id", pessoa_id)
      .maybeSingle();

    if (!pessoa)
      return res.status(404).json({ error: "Pessoa não encontrada" });

    // Verificar se equipe existe
    const { data: equipe } = await supabase
      .from("equipes")
      .select("id")
      .eq("id", equipe_id)
      .maybeSingle();

    if (!equipe)
      return res.status(404).json({ error: "Equipe não encontrada" });

    // Verificar se pessoa já está na equipe
    const { data: jaExiste } = await supabase
      .from("teamrole")
      .select("id")
      .eq("pessoa_id", pessoa_id)
      .eq("equipe_id", equipe_id)
      .maybeSingle();

    if (jaExiste)
      return res.status(400).json({ error: "Essa pessoa já faz parte da equipe" });

    // Verificar se já existe líder na equipe (opcional)
    if (is_leader) {
      const { data: liderExistente } = await supabase
        .from("teamrole")
        .select("id")
        .eq("equipe_id", equipe_id)
        .eq("is_leader", true)
        .maybeSingle();

      if (liderExistente)
        return res.status(400).json({ error: "A equipe já possui um líder" });
    }

    // Inserir novo membro
    const { data, error } = await supabase
      .from("teamrole")
      .insert([{ pessoa_id, equipe_id, is_leader }])
      .select()
      .single();

    if (error)
      return res.status(400).json({ error: error.message });

    return res.status(201).json(data);
  } catch (err) {
    console.error("Erro ao adicionar membro:", err);
    return res.status(500).json({ error: "Erro interno ao adicionar membro à equipe" });
  }
}


// ======================================================
// 📌 Remover membro
// ======================================================
export async function removerTeamrole(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("teamrole")
      .delete()
      .eq("id", id);

    if (error)
      return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Membro removido da equipe" });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao remover membro" });
  }
}


// ======================================================
// 📌 Listar membros por equipe
// ======================================================
export async function listarMembrosPorEquipe(req, res) {
  try {
    const { equipe_id } = req.params;

    const { data, error } = await supabase
      .from("teamrole")
      .select(`
        id,
        is_leader,
        created_at,
        pessoa:pessoa_id ( id, nome, email, telefone )
      `)
      .eq("equipe_id", equipe_id);

    if (error)
      return res.status(400).json({ error: error.message });

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao listar membros" });
  }
}


// ======================================================
// 📌 Listar todos os teamroles
// ======================================================
export async function listarTeamroles(req, res) {
  try {
    const { data, error } = await supabase
      .from("teamrole")
      .select(`
        id,
        is_leader,
        created_at,
        pessoa:pessoa_id ( id, nome, email ),
        equipe:equipe_id ( id, nome )
      `);

    if (error)
      return res.status(400).json({ error: error.message });

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro interno ao listar teamroles" });
  }
}


// ======================================================
// 📌 Buscar um teamrole por ID  (necessária para o EDITAR)
// ======================================================
export async function buscarTeamrolePorId(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("teamrole")
      .select(`
        id,
        pessoa_id,
        equipe_id,
        is_leader,
        pessoa:pessoa_id ( id, nome, email ),
        equipe:equipe_id ( id, nome )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro Supabase:", error);
      return res.status(404).json({ error: "Vínculo não encontrado" });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("Erro ao buscar teamrole:", err);
    return res.status(500).json({ error: "Erro interno ao buscar vínculo" });
  }
}
// ======================================================
// 📌 Atualizar um teamrole (editar vínculo)
// ======================================================
export async function atualizarTeamrole(req, res) {
  try {
    const { id } = req.params;
    const { pessoa_id, equipe_id, is_leader } = req.body;

    // Verificar se o vínculo existe
    const { data: atual, error: erroBusca } = await supabase
      .from("teamrole")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (erroBusca || !atual) {
      return res.status(404).json({ error: "Vínculo não encontrado" });
    }

    // Atualizar registro
    const { error } = await supabase
      .from("teamrole")
      .update({
        pessoa_id,
        equipe_id,
        is_leader
      })
      .eq("id", id);

    if (error) {
      console.error("Erro Supabase:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: "Vínculo atualizado com sucesso" });

  } catch (err) {
    console.error("Erro ao atualizar vínculo:", err);
    return res.status(500).json({ error: "Erro interno ao atualizar vínculo" });
  }
}
