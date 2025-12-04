// src/controllers/auth.controller.js
import supabase from "../config/supabase.js";

/**
 * POST /auth/link
 * - Deve ser chamado com Authorization: Bearer <access_token>
 * - Cria um registro em pessoas (se não existir) e seta pessoas.auth_uid = authUser.id
 * - Retorna a pessoa vinculada
 */
export async function linkAuthToPessoa(req, res) {
  try {
    const authUser = req.authUser;
    if (!authUser) return res.status(401).json({ error: "Usuário não autenticado" });

    // Checa se já existe pessoa com auth_uid
    const { data: existing, error: existingError } = await supabase
      .from("pessoas")
      .select("*")
      .eq("auth_uid", authUser.id)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);
      return res.status(500).json({ error: "Erro ao verificar pessoa existente" });
    }

    if (existing && existing.id) {
      return res.status(200).json(existing);
    }

    // Se não existe, tenta encontrar por email (opcional)
    let pessoaToLink = null;
    if (authUser.email) {
      const { data: byEmail } = await supabase
        .from("pessoas")
        .select("*")
        .eq("email", authUser.email)
        .maybeSingle();

      if (byEmail && byEmail.id) pessoaToLink = byEmail;
    }

    // Se não encontrou por email, cria nova pessoa
    if (!pessoaToLink) {
      const nome = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email || "Usuário";
      const { data: created, error: createErr } = await supabase
        .from("pessoas")
        .insert([{ nome, email: authUser.email || null, telefone: null, auth_uid: authUser.id }])
        .select()
        .single();

      if (createErr) {
        console.error("Erro ao criar pessoa:", createErr);
        return res.status(500).json({ error: "Erro ao criar pessoa" });
      }

      return res.status(201).json(created);
    }

    // Se encontrou por email, atualiza auth_uid
    const { data: updated, error: updateErr } = await supabase
      .from("pessoas")
      .update({ auth_uid: authUser.id })
      .eq("id", pessoaToLink.id)
      .select()
      .single();

    if (updateErr) {
      console.error("Erro ao atualizar pessoa com auth_uid:", updateErr);
      return res.status(500).json({ error: "Erro ao vincular conta" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Erro em linkAuthToPessoa:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

/**
 * GET /auth/me
 * - Retorna o usuário auth + pessoa vinculada (se houver)
 */
export async function me(req, res) {
  try {
    const authUser = req.authUser;
    if (!authUser) return res.status(401).json({ error: "Usuário não autenticado" });

    return res.status(200).json({ authUser, pessoa: req.pessoa || null });
  } catch (err) {
    console.error("Erro em /auth/me:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
