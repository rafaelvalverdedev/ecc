import supabase from "../config/supabase.js";

// CRIAR COORDENADOR
export async function criarCoordenador(req, res) {
  try {
    const { name, email, senha, telefone } = req.body;

    // Validação básica
    if (!name || !email || !senha) {
      return res.status(400).json({
        error: "Os campos 'name', 'email' e 'senha' são obrigatórios"
      });
    }

    // 1️⃣ Criar usuário no auth
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { role: "coordenador" }
    });

    if (authError) {
      console.error("Erro ao criar usuário no auth:", authError);
      return res.status(400).json({ error: authError.message });
    }

    // UID do auth
    const auth_uid = user.user.id;

    // 2️⃣ Criar coordenador na tabela pessoas
    const { data: pessoa, error: pessoaError } = await supabase
      .from("pessoas")
      .insert([{
        nome: name,
        email,
        telefone,
        role: "coordenador",
        auth_uid
      }])
      .select()
      .single();

    if (pessoaError) {
      console.error("Erro ao criar pessoa:", pessoaError);
      return res.status(400).json({ error: pessoaError.message });
    }

    return res.status(201).json({
      message: "Coordenador criado com sucesso",
      pessoa
    });

  } catch (err) {
    console.error("ERRO AO CRIAR COORDENADOR:", err);
    return res.status(500).json({ error: "Erro interno ao criar coordenador" });
  }
}

// LISTAR COORDENADORES
export async function listarCoordenadores(req, res) {
  try {
    const { data, error } = await supabase
      .from("pessoas")
      .select("*")
      .eq("role", "coordenador");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao listar coordenadores" });
  }
}

// BUSCAR COORDENADOR POR ID
export async function buscarCoordenadorPorId(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("pessoas")
      .select("*")
      .eq("id", id)
      .eq("role", "coordenador")
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Coordenador não encontrado" });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao buscar coordenador" });
  }
}

// ATUALIZAR COORDENADOR
export async function atualizarCoordenador(req, res) {
  try {
    const { id } = req.params;
    const { name, email, telefone } = req.body;

    if (!name && !email && !telefone) {
      return res.status(400).json({
        error: "Informe ao menos um campo para atualização"
      });
    }

    const { data, error } = await supabase
      .from("pessoas")
      .update({ nome: name, email, telefone })
      .eq("id", id)
      .eq("role", "coordenador")
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Coordenador não encontrado" });
    }

    return res.status(200).json({
      message: "Coordenador atualizado com sucesso",
      data
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao atualizar coordenador" });
  }
}

// DELETAR COORDENADOR
export async function deletarCoordenador(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("pessoas")
      .delete()
      .eq("id", id)
      .eq("role", "coordenador");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Coordenador deletado com sucesso"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao deletar coordenador" });
  }
}
