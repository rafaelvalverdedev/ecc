import supabase from "../config/supabase.js";

/**
 * Define as roles possíveis
 */
export const Roles = {
  ADMIN: "admin",
  COORDENADOR: "coordenador",
  ENCONTREIRO: "encontreiro",
};

/**
 * Middleware: exige token JWT válido
 */
export async function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Token inválido" });
  }

  req.user = data.user;
  next();
}

/**
 * Middleware: exige uma role específica
 * Exemplo: requireRole(Roles.ADMIN)
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.user_metadata?.role;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  };
}
