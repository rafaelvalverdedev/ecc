// ======================================================
// 📌 TEAMROLE CONTROLLER — SEM LÓGICA DE PAGAMENTOS
// ======================================================

import supabase from "../config/supabase.js";
import { z } from "zod";

// ======================================================
// 📌 ZOD SCHEMAS
// ======================================================

const teamroleSchema = z.object({
  pessoa_id: z.string().uuid("pessoa_id deve ser um UUID válido"),
  equipe_id: z.string().uuid("equipe_id deve ser um UUID válido"),
  evento_id: z.string().uuid("evento_id deve ser um UUID válido"),
  is_leader: z.boolean().optional().default(false)
});

const teamroleUpdateSchema = z.object({
  pessoa_id: z.string().uuid("pessoa_id deve ser um UUID válido"),
  equipe_id: z.string().uuid("equipe_id deve ser um UUID válido"),
  evento_id: z.string().uuid("evento_id deve ser um UUID válido"),
  is_leader: z.boolean()
});

// ======================================================
// 📌 CRIAR VÍNCULO TEAMROLE (cadastro do encontreiro)
// ======================================================
export async function adicionarTeamrole(req, res) {
  try {
    const parsed = teamroleSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message || "Dados inválidos"
      });
    }

    const { pessoa_id, equipe_id, evento_id, is_leader } = parsed.data;

    const { data, error } = await supabase
      .from("teamrole")
      .insert([{ pessoa_id, equipe_id, evento_id, is_leader }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json(data);

  } catch (err) {
    console.error("Erro ao adicionar teamrole:", err);
    return res.status(500).json({ error: "Erro interno ao criar vínculo" });
  }
}

// ======================================================
// 📌 LISTAR TEAMROLES
// ======================================================
export async function listarTeamroles(req, res) {
  try {
    const { data, error } = await supabase
      .from("teamrole")
      .select(`
          id,
          pessoa_id,
          equipe_id,
          evento_id,
          is_leader,
          pagou,
          pessoa:pessoa_id ( id, nome, email, telefone ),
          equipe:equipe_id ( id, nome ),
          evento:evento_id ( id, nome )
      `);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao listar teamroles:", err);
    return res.status(500).json({ error: "Erro interno ao listar vínculos" });
  }
}

// ======================================================
// 📌 BUSCAR POR ID
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
        evento_id,
        is_leader,
        pessoa:pessoa_id ( id, nome, email, telefone ),
        equipe:equipe_id ( id, nome ),
        evento:evento_id ( id, nome )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Vínculo não encontrado" });

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar teamrole:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

// ======================================================
// 📌 ATUALIZAR
// ======================================================
export async function atualizarTeamrole(req, res) {
  try {
    const { id } = req.params;

    const parsed = teamroleUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.issues[0]?.message || "Dados inválidos"
      });
    }

    const { pessoa_id, equipe_id, evento_id, is_leader } = parsed.data;

    const { error } = await supabase
      .from("teamrole")
      .update({
        pessoa_id,
        equipe_id,
        evento_id,
        is_leader
      })
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Vínculo atualizado com sucesso" });

  } catch (err) {
    console.error("Erro ao atualizar teamrole:", err);
    return res.status(500).json({ error: "Erro interno ao atualizar vínculo" });
  }
}

// ======================================================
// 📌 REMOVER
// ======================================================
export async function removerTeamrole(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("teamrole")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Vínculo removido com sucesso" });

  } catch (err) {
    console.error("Erro ao remover teamrole:", err);
    return res.status(500).json({ error: "Erro interno ao remover vínculo" });
  }
}

// ======================================================
// 📌 LISTAR MEMBROS POR EQUIPE
// ======================================================
export async function listarMembrosPorEquipe(req, res) {
  try {
    const { equipe_id } = req.params;

    const { data, error } = await supabase
      .from("teamrole")
      .select(`
        id,
        is_leader,
        pessoa:pessoa_id ( id, nome ),
        evento:evento_id ( id, nome )
      `)
      .eq("equipe_id", equipe_id);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json(data);

  } catch (err) {
    console.error("Erro ao listar membros por equipe:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
