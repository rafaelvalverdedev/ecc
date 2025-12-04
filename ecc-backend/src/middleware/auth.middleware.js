// src/middleware/auth.middleware.js
import supabase from "../config/supabase.js";

/**
 * ensureAuthenticated
 * - espera header Authorization: Bearer <token>
 * - valida token via supabase.auth.getUser(token)
 * - busca pessoa vinculada em pessoas.auth_uid
 * - anexa: req.authUser, req.userRole, req.pessoa
 */
export async function ensureAuthenticated(req, res, next) {
  try {
    const header = req.headers["authorization"] || req.headers["Authorization"];
    if (!header) return res.status(401).json({ error: "Missing Authorization header" });

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Malformed Authorization header" });
    }

    const token = parts[1];

    // valida token
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const authUser = userData.user;
    req.authUser = authUser;

    // pega role direto do metadata do auth
    const roleFromAuth = authUser.user_metadata?.role || null;
    req.userRole = roleFromAuth;

    // busca pessoa vinculada
    const { data: pessoa, error: pessoaError } = await supabase
      .from("pessoas")
      .select("*")
      .eq("auth_uid", authUser.id)
      .maybeSingle();

    if (pessoaError) {
      console.error("Erro ao buscar pessoa por auth_uid:", pessoaError);
      // não aborta, só loga
    }

    // se não vinculada, tenta por email (não faz link automático aqui)
    if (!pessoa) {
      if (authUser.email) {
        const { data: byEmail } = await supabase
          .from("pessoas")
          .select("*")
          .eq("email", authUser.email)
          .maybeSingle();
        req.pessoa = byEmail || null;
      } else {
        req.pessoa = null;
      }
    } else {
      req.pessoa = pessoa;
    }

    return next();
  } catch (err) {
    console.error("Erro no ensureAuthenticated:", err);
    return res.status(500).json({ error: "Erro interno no auth" });
  }
}
