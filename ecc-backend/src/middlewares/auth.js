import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido");
}

const JWT_SECRET = process.env.JWT_SECRET;

export const Roles = {
  ADMIN: "admin",
  USER: "user",
  COORDENADOR: "coordenador"
};

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  const token = header.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  };
}
