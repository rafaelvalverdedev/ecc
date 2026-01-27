import supabase from "../config/supabase.js";
import pkg from "bcryptjs";
const bcrypt = pkg;
import jwt from "jsonwebtoken";
import { z } from "zod";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido");
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Schemas
const registerSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  telefone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(["user", "admin", "coordenador"]).default("user")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function gerarToken(pessoa) {
  return jwt.sign(
    {
      sub: pessoa.id,
      email: pessoa.email,
      role: pessoa.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
// Atualização
export async function atualiza(req, res) {
  try {
    // Validação dos dados
    const { email, role } = registerSchema.parse(req.body);

    console.log(email);  // Verifica o email

    // Atualiza o registro no banco de dados
    const { data, error } = await supabase
      .from("pessoas")
      .update({
        role
      })
      .eq("email", email)  // Atualiza pelo email
      .select()  // Seleciona o campo atualizado
      .single();  // Espera que apenas um registro seja retornado

    // Verifica se houve erro na atualização
    if (error) {
      console.error("REGISTER DB ERROR:", error);
      return res.status(500).json({ error: "Erro ao atualizar o registro." });
    }

    // Verifica se o dado foi encontrado
    if (!data) {
      return res.status(404).json({ error: "Pessoa não encontrada." });
    }

    // Gera o token para a pessoa
    const token = gerarToken(data);

    // Retorna o sucesso com os dados da pessoa e o token gerado
    return res.status(200).json({ pessoa: data, token });

  } catch (err) {
    console.error(err);  // Log de erro
    return res.status(400).json({ error: err.message });
  }
}


// Registro
export async function register(req, res) {
  try {
    const { nome, email, telefone, password, role } = registerSchema.parse(req.body);

    console.error(role);


    const { data: existente } = await supabase
      .from("pessoas")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existente) {
      return res.status(409).json({ error: "Email já cadastrado." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("pessoas")
      .insert({
        nome,
        email,
        telefone,
        password_hash,
        role
      })
      .select()
      .single();

    if (error) {
      console.error("REGISTER DB ERROR:", error);
      return res.status(500).json({ error: "Erro ao criar usuário." });
    }

    const token = gerarToken(data);

    return res.status(201).json({ pessoa: data, token });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const { data: pessoa } = await supabase
      .from("pessoas")
      .select("id, nome, email, telefone, role, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (!pessoa || !pessoa.password_hash) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const senhaCorreta = await bcrypt.compare(password, pessoa.password_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = gerarToken(pessoa);

    return res.status(200).json({
      pessoa: {
        id: pessoa.id,
        nome: pessoa.nome,
        email: pessoa.email,
        telefone: pessoa.telefone,
        role: pessoa.role,
      },
      token,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// teamroleCadastro
export async function teamroleCadastro(req, res) {
  try {
  const email = req.params.email; // pega o email da URL

    const {data: pessoa, error } = await supabase
      .from("pessoas")
      .select(`
        email,
        cadastro:cadastro!inner(
          email_esposo,
          email_esposa,
          teamrole:teamrole!left(
            evento_id,
            cadastro_id,
            eventos:eventos!left(
              id,
              nome
            )
          )
        )
      `)
      .eq("email", email)
      .maybeSingle();

    if (error) {
      throw new Error(error.message + email);
    }

    if (!email) {
      return res.status(404).json({ error: "Pessoa não encontrada." + email  });
    }

    return res.status(200).json({
      pessoa: {
        id: pessoa.id,
        nome: pessoa.nome,
        email: pessoa.email,
        telefone: pessoa.telefone,
        role: pessoa.role,
        cadastro: pessoa.cadastro, // inclui cadastro + teamrole + evento
      },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

