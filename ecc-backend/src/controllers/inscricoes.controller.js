import supabase from "../config/supabase.js";
import { z } from "zod";

export const inscricaoSchema = z.object({
  evento_id: z.string().uuid({ message: "evento_id inválido" }),
  pessoa_id: z.string().uuid({ message: "pessoa_id inválido" }),
  tipo: z.enum(["encontrista", "encontreiro"], {
    message: "tipo deve ser 'encontrista' ou 'encontreiro'",
  }),
});


// =========================
// Criar inscrição
// =========================
export async function criarInscricao(req, res) {
  try {
    // 1) Validação ZOD
    const parseResult = inscricaoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }

    const { evento_id, pessoa_id, tipo, equipe_id } = parseResult.data;

    // 2) Verificar se evento existe
    const { data: evento, error: eventoError } = await supabase
      .from("eventos")
      .select("*")
      .eq("id", evento_id)
      .single();

    if (eventoError || !evento) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    // 3) Verificar se pessoa existe
    const { data: pessoa, error: pessoaError } = await supabase
      .from("pessoas")
      .select("*")
      .eq("id", pessoa_id)
      .single();

    if (pessoaError || !pessoa) {
      return res.status(404).json({ error: "Pessoa não encontrada" });
    }

    // 4) Verificar se pessoa já está inscrita no evento
    const { data: inscricaoExistente } = await supabase
      .from("inscricoes")
      .select("*")
      .eq("evento_id", evento_id)
      .eq("pessoa_id", pessoa_id)
      .maybeSingle();

    if (inscricaoExistente) {
      return res.status(400).json({ error: "Esta pessoa já está inscrita neste evento" });
    }

    // ===============================
    // 5) Regra ESPECIAL para ENCONTREIRO
    // ===============================
    if (tipo === "encontreiro") {

      // 5.1) Encontrar o papel da pessoa
      const { data: role, error: roleError } = await supabase
        .from("teamrole")
        .select("equipe_id")
        .eq("pessoa_id", pessoa_id)
        .single();

      if (roleError || !role) {
        return res.status(400).json({
          error: "Esta pessoa não pertence a nenhuma equipe — não pode ser encontreiro"
        });
      }

      const equipeDoEncontreiro = role.equipe_id;

      // 5.2) Verificar se a equipe participa do evento
      const { data: equipeEvento, error: equipeEventoError } = await supabase
        .from("equipes_evento")
        .select("*")
        .eq("evento_id", evento_id)
        .eq("equipe_id", equipeDoEncontreiro)
        .maybeSingle();

      if (equipeEventoError || !equipeEvento) {
        return res.status(400).json({
          error: "A equipe deste encontreiro não participa deste evento"
        });
      }
    }

    // ===============================
    // 6) Criar inscrição
    // ===============================
    const { data, error } = await supabase
      .from("inscricoes")
      .insert([
        {
          evento_id,
          pessoa_id,
          tipo,
          status: "pending"
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao criar inscrição" });
  }
}

// =========================
// Listar todas as inscrições
// =========================
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
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao listar inscrições" });
  }
}

// =========================
// Buscar por ID
// =========================
export async function buscarInscricao(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("inscricoes")
      .select(`
        id,
        status,
        tipo,
        pessoa:pessoa_id ( id, nome ),
        evento:evento_id ( id, nome )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Inscrição não encontrada" });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao buscar inscrição" });
  }
}

// =========================
// Atualizar inscrição
// =========================
export async function atualizarInscricao(req, res) {
  try {
    const { id } = req.params;
    const { status, tipo } = req.body;

    const { data, error } = await supabase
      .from("inscricoes")
      .update({ status, tipo })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Inscrição não encontrada" });
    }

    return res.status(200).json({ message: "Inscrição atualizada", data });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao atualizar inscrição" });
  }
}

// =========================
// Remover inscrição
// =========================
export async function deletarInscricao(req, res) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("inscricoes")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(404).json({ error: "Inscrição não encontrada" });
    }

    return res.status(200).json({ message: "Inscrição removida" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao deletar inscrição" });
  }
}
