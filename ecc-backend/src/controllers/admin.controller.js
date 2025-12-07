import supabase from "../config/supabase.js";
import pkg from "bcryptjs";
const bcrypt = pkg;

// Criar usuário no painel Admin
export async function createUserByAdmin(req, res) {
  try {
    const { nome, email, telefone, password, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email e senha obrigatórios." });
    }

    // Verificar se email já existe
    const { data: existente, error: buscaErro } = await supabase
      .from("pessoas")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (buscaErro) {
      console.error("Erro ao verificar email existente:", buscaErro);
      return res.status(500).json({ error: "Erro ao verificar email" });
    }

    if (existente) {
      return res.status(400).json({ error: "Email já cadastrado." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Inserir pessoa
    const { data: pessoa, error } = await supabase
      .from("pessoas")
      .insert({
        nome,
        email,
        telefone,
        password_hash,
        role: role || "user",
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir pessoa:", error);
      return res.status(500).json({ error: "Erro ao criar pessoa" });
    }

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      pessoa,
    });
  } catch (err) {
    console.error("ERRO ADMIN CONTROLLER:", err);
    return res.status(500).json({ error: "Erro ao criar pessoa" });
  }
}
