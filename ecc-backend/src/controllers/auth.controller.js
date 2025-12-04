import supabase from "../config/supabase.js";
import pkg from "bcryptjs";
const bcrypt = pkg;
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ==========================
// Zod Schemas
// ==========================
export const registerSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6),
});

// ==========================
// Função para gerar token JWT
// ==========================
function gerarToken(pessoa) {
  return jwt.sign(
    {
      sub: pessoa.id,
      role: pessoa.role || null,
      email: pessoa.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// ==========================
// POST /auth/register
// ==========================
export async function register(req, res) {
  try {
    const parsed = registerSchema.parse(req.body);
    const { nome, email, telefone, password, role } = parsed;

    const { data: existente } = await supabase
      .from("pessoas")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existente) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("pessoas")
      .insert([{ nome, email, telefone, password_hash, role }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    const token = gerarToken(data);

    return res.status(201).json({ pessoa: data, token });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}

// ==========================
// POST /auth/login
// ==========================
export async function login(req, res) {
  try {
    const parsed = loginSchema.parse(req.body);
    const { email, password } = parsed;

    const { data: pessoa, error } = await supabase
      .from("pessoas")
      .select("id, nome, email, telefone, password_hash")
      .eq("email", email)
      .single();

    if (error || !pessoa) {
      console.log("Usuário não encontrado:", email);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    if (!pessoa.password_hash) {
      return res.status(400).json({ error: "Usuário sem senha cadastrada" });
    }

    const senhaCorreta = password === pessoa.password_hash;

    if (!senhaCorreta) {
      console.log("Senha incorreta:", password, pessoa.password_hash);
      return res.status(401).json({ error: "Credenciais inválidas" });
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
    console.error("LOGIN ERROR:", err);
    return res.status(400).json({ error: err.message });
  }
}
