import supabase from "../config/supabase.js";
import { z } from "zod";

export const inscricaoSchema = z.object({
  evento_id: z.string().uuid({ message: "evento_id inválido" }),
  pessoa_id: z.string().uuid({ message: "pessoa_id inválido" }),
  tipo: z.enum(["encontrista", "encontreiro"], {
    message: "tipo deve ser 'encontrista' ou 'encontreiro'",
  }),
});

// ======================================================
// 📌 CRIAR INSCRIÇÃO (APENAS ENCONTRISTA)
// ======================================================
export async function criarInscricao(req, res) {
  try {
    const parseResult = inscricaoSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues[0]?.message || "Dados inválidos"
      });
    }

    const { evento_id, pessoa_id } = parseResult.data;

    // Criar inscrição de encontrista
    const { data, error } = await supabase
      .from("inscricoes")
      .insert([{ evento_id, pessoa_id, tipo: "encontrista" }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json(data);

  } catch (err) {
    console.error("Erro ao criar inscrição:", err);
    return res.status(500).json({ error: "Erro interno ao criar inscrição" });
  }
}

// ======================================================
// 📌 LISTAR INSCRIÇÕES
// ======================================================
export async function listarInscricoes(req, res) {
  try {
    const { data, error } = await supabase
      .from("inscricoes")
      .select(`
        id,
        status,
        tipo,
        created_at,
        pessoa:pessoa_id ( id, nome, email, telefone ),
        evento:evento_id ( id, nome, start_date )
      `);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao listar inscrições:", err);
    return res.status(500).json({ error: "Erro ao listar inscrições" });
  }
}

// ======================================================
// 📌 BUSCAR INSCRIÇÃO POR ID
// ======================================================
export async function buscarInscricao(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("inscricoes")
      .select(`
        id,
        status,
        tipo,
        pessoa:pessoa_id ( id, nome, email, telefone ),
        evento:evento_id ( id, nome, start_date )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Inscrição não encontrada" });

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar inscrição:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

// ======================================================
// 📌 ATUALIZAR INSCRIÇÃO
// ======================================================
export async function atualizarInscricao(req, res) {
  try {
    const { id } = req.params;

    const parseResult = inscricaoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues[0]?.message || "Dados inválidos"
      });
    }

    const { pessoa_id, evento_id } = parseResult.data;

    const { error } = await supabase
      .from("inscricoes")
      .update({ pessoa_id, evento_id })
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Inscrição atualizada com sucesso" });

  } catch (err) {
    console.error("Erro ao atualizar inscrição:", err);
    return res.status(500).json({ error: "Erro ao atualizar inscrição" });
  }
}

// ======================================================
// 📌 DELETAR INSCRIÇÃO
// ======================================================
export async function deletarInscricao(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("inscricoes")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: "Inscrição removida com sucesso" });

  } catch (err) {
    console.error("Erro ao remover inscrição:", err);
    return res.status(500).json({ error: "Erro ao remover inscrição" });
  }
}
