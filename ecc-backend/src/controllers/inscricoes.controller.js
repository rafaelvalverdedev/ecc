import supabase from "../config/supabase.js";
import { z } from "zod";

// =====================================================
// DTO / VALIDAÇÃO DO FORMULÁRIO DE ENCONTRISTA
// =====================================================
const encontristaInscricaoSchema = z.object({
  esposo: z.object({
    nomeCompleto: z.string().min(1),
    dataNascimento: z.string(),
    profissao: z.string().min(1),
    celular: z.string().min(1),
    religiao: z.string().min(1),
    escolaridade: z.string().min(1)
  }),
  esposa: z.object({
    nomeCompleto: z.string().min(1),
    dataNascimento: z.string(),
    profissao: z.string().min(1),
    celular: z.string().min(1),
    religiao: z.string().min(1),
    escolaridade: z.string().min(1)
  }),
  casal: z.object({
    endereco: z.string().min(1),
    cidade: z.string().min(1),
    uf: z.string().length(2),
    email: z.string().email(),
    telefone: z.string().min(1),
    possuiFilhos: z.boolean(),
    quantidadeFilhos: z.number().optional(),
    nomeResponsavel: z.string().optional(),
    telefoneResponsavel: z.string().optional()
  })
});

// =====================================================
// CRIAR INSCRIÇÃO DE ENCONTRISTA (FORMULÁRIO)
// =====================================================
export async function criarEncontristaInscricao(req, res) {
  try {
    // 1️⃣ valida DTO
    const parsed = encontristaInscricaoSchema.parse(req.body);

    // 2️⃣ regras de negócio
    if (parsed.casal.possuiFilhos) {
      if (
        !parsed.casal.quantidadeFilhos ||
        !parsed.casal.nomeResponsavel ||
        !parsed.casal.telefoneResponsavel
      ) {
        return res.status(400).json({
          error: "Dados dos filhos são obrigatórios"
        });
      }
    }

    // 3️⃣ monta objeto conforme tabela encontrista_inscricao
    const toInsert = {
      // esposo
      nome_completo_esposo: parsed.esposo.nomeCompleto,
      data_nascimento_esposo: parsed.esposo.dataNascimento,
      profissao_esposo: parsed.esposo.profissao,
      celular_esposo: parsed.esposo.celular,
      religiao_esposo: parsed.esposo.religiao,
      escolaridade_esposo: parsed.esposo.escolaridade,

      // esposa
      nome_completo_esposa: parsed.esposa.nomeCompleto,
      data_nascimento_esposa: parsed.esposa.dataNascimento,
      profissao_esposa: parsed.esposa.profissao,
      celular_esposa: parsed.esposa.celular,
      religiao_esposa: parsed.esposa.religiao,
      escolaridade_esposa: parsed.esposa.escolaridade,

      // casal
      endereco: parsed.casal.endereco,
      cidade: parsed.casal.cidade,
      uf: parsed.casal.uf,
      email: parsed.casal.email,
      telefone_principal: parsed.casal.telefone,
      possui_filhos: parsed.casal.possuiFilhos,
      quantidade_filhos: parsed.casal.possuiFilhos
        ? parsed.casal.quantidadeFilhos
        : null,
      nome_responsavel_filhos: parsed.casal.possuiFilhos
        ? parsed.casal.nomeResponsavel
        : null,
      telefone_responsavel: parsed.casal.possuiFilhos
        ? parsed.casal.telefoneResponsavel
        : null
    };

    // 4️⃣ insere no banco
    const { data, error } = await supabase
      .from("encontrista_inscricao")
      .insert(toInsert)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Inscrição de encontrista registrada com sucesso",
      data
    });
  } catch (err) {
    console.error("CRIAR ENCONTRISTA INSCRICAO ERROR:", err);

    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }

    return res.status(500).json({ error: err.message });
  }
}

// =====================================================
// LISTAR INSCRIÇÕES DE ENCONTRISTAS (ADMIN)
// =====================================================
export async function listarEncontristaInscricoes(req, res) {
  try {
    const { data, error } = await supabase
      .from("encontrista_inscricao")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ data });
  } catch (err) {
    console.error("LISTAR ENCONTRISTA INSCRICAO ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
