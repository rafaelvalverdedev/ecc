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

// Registro
export async function register(req, res) {
  try {
    const { nome, email, telefone, password } = registerSchema.parse(req.body);

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
        role: "user",
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
