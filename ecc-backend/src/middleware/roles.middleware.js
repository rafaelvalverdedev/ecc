// src/middleware/roles.middleware.js
import supabase from "../config/supabase.js";

/**
 * Generic role checker
 */
export function requireRole(role) {
  return (req, res, next) => {
    const userRole = req.userRole;
    if (!userRole) return res.status(403).json({ error: "Role not set" });
    if (Array.isArray(role)) {
      if (!role.includes(userRole)) return res.status(403).json({ error: "Forbidden" });
    } else {
      if (userRole !== role) return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}

export const requireAdmin = requireRole("admin");
export const requireCoordenador = requireRole("coordenador");
export const requireEncontreiro = requireRole("encontreiro");

/**
 * requireCoordenadorOfEquipe
 * - expects req.params.equipe_id or req.body.equipe_id
 */
export async function requireCoordenadorOfEquipe(req, res, next) {
  try {
    const pessoa = req.pessoa;
    if (!pessoa) return res.status(403).json({ error: "Pessoa não vinculada" });

    const equipeId = req.params.equipe_id || req.body.equipe_id || req.query.equipe_id;
    if (!equipeId) return res.status(400).json({ error: "equipe_id obrigatório" });

    const { data: equipe, error } = await supabase
      .from("equipes")
      .select("id, coordinator_1_id, coordinator_2_id")
      .eq("id", equipeId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar equipe:", error);
      return res.status(500).json({ error: "Erro ao verificar equipe" });
    }

    if (!equipe) return res.status(404).json({ error: "Equipe não encontrada" });

    const isCoordinator = (equipe.coordinator_1_id === pessoa.id) || (equipe.coordinator_2_id === pessoa.id) || req.userRole === "admin";
    if (!isCoordinator) return res.status(403).json({ error: "Você não é coordenador desta equipe" });

    return next();
  } catch (err) {
    console.error("Erro requireCoordenadorOfEquipe:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

/**
 * requireMemberOfEquipe
 * - verifies the user is member (teamrole) of an equipe
 */
export async function requireMemberOfEquipe(req, res, next) {
  try {
    const pessoa = req.pessoa;
    if (!pessoa) return res.status(403).json({ error: "Pessoa não vinculada" });

    const equipeId = req.params.equipe_id || req.body.equipe_id || req.query.equipe_id;
    if (!equipeId) return res.status(400).json({ error: "equipe_id obrigatório" });

    const { data, error } = await supabase
      .from("teamrole")
      .select("*")
      .eq("equipe_id", equipeId)
      .eq("pessoa_id", pessoa.id)
      .limit(1);

    if (error) {
      console.error("Erro ao verificar membro:", error);
      return res.status(500).json({ error: "Erro ao verificar membro" });
    }

    if (!data || data.length === 0) return res.status(403).json({ error: "Você não é membro desta equipe" });

    return next();
  } catch (err) {
    console.error("Erro requireMemberOfEquipe:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
