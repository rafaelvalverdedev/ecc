import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const Roles = {
  ADMIN: "admin",
  USER: "user",
  COORDENADOR: "coordenador"
};

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ error: "Token não fornecido" });

  const token = header.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role)
      return res.status(403).json({ error: "Acesso negado" });

    next();
  };
}
