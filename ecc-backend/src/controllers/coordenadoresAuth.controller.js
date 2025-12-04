import supabase from "../config/supabase.js";
import { Roles } from "../middlewares/auth.js";

/**
 * Criar Coordenador (Somente ADMIN)
 */
export async function criarCoordenador(req, res) {
  try {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: "nome, email e senha são obrigatórios"
      });
    }

    // 1) Criar usuário no Supabase Auth
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: senha,
        email_confirm: true, // já deixa confirmado
        user_metadata: { role: Roles.COORDENADOR, nome },
      });

    if (authError) {
      console.error("Erro ao criar usuário:", authError);
      return res.status(500).json({ error: "Erro ao criar usuário no auth" });
    }

    const userId = authUser.user.id;

    // 2) Criar registro na tabela pessoas
    const { data: pessoa, error: pessoaError } = await supabase
      .from("pessoas")
      .insert({
        id: userId,
        nome,
        email,
        telefone,
      })
      .select()
      .single();

    if (pessoaError) {
      console.error("Erro ao criar pessoa:", pessoaError);

      // rollback: opcional — deletar user se deu erro aqui
      await supabase.auth.admin.deleteUser(userId);

      return res.status(500).json({ error: "Erro ao salvar coordenador na tabela pessoas" });
    }

    return res.status(201).json({
      message: "Coordenador criado com sucesso",
      auth: authUser,
      pessoa,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro inesperado" });
  }
}
