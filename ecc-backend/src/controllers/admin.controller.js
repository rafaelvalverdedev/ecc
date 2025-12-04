// src/controllers/admin.controller.js
import supabase from "../config/supabase.js";

/**
 * POST /admin/create-user
 * Body: { email, password, role, nome, telefone }
 * - Only accessible to admin (you)
 * - Creates user via supabase.auth.admin.createUser (service_role)
 * - Inserts pessoa e sets auth_uid and role field
 */
export async function createUserByAdmin(req, res) {
  try {
    const { email, password, role, nome = null, telefone = null } = req.body;
    if (!email || !password || !role) return res.status(400).json({ error: "email, password e role são obrigatórios" });

    // cria user via admin API
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // já marca como confirmado em dev
      user_metadata: { role }
    });

    if (createErr) {
      console.error("Erro ao criar user no auth:", createErr);
      return res.status(500).json({ error: "Erro ao criar usuário no auth" });
    }

    // cria pessoa vinculada
    const { data: pessoa, error: pessoaErr } = await supabase
      .from("pessoas")
      .insert([{ nome: nome || email, email, telefone, auth_uid: newUser.id, role }])
      .select()
      .single();

    if (pessoaErr) {
      console.error("Erro ao criar pessoa:", pessoaErr);
      return res.status(500).json({ error: "Erro ao criar pessoa" });
    }

    return res.status(201).json({ user: newUser, pessoa });
  } catch (err) {
    console.error("Erro createUserByAdmin:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
