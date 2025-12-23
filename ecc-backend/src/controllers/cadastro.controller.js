import supabase from "../config/supabase.js";
// import { z } from "zod";

// // ========================================================
// // VALIDAÇÃO DO FORMULÁRIO (ZOD) — ALINHADA AO BANCO
// // ========================================================
// const encontristaSchema = z.object({
//     // esposo
//     nome_completo_esposo: z.string().min(3),
//     email_esposo: z.string().email(),
//     data_nascimento_esposo: z.string().optional().nullable(),
//     profissao_esposo: z.string().optional().nullable(),
//     como_chamar_esposo: z.string().optional().nullable(),
//     igreja_esposo: z.string().optional().nullable(),
//     local_trabalho_esposo: z.string().optional().nullable(),
//     celular_esposo: z.string().optional().nullable(),
//     instagram_esposo: z.string().optional().nullable(),
//     restricoes_alimentares_esposo: z.string().optional().nullable(),
//     medicamentos_alergias_esposo: z.string().optional().nullable(),
//     religiao_esposo: z.string().optional().nullable(),
//     escolaridade_esposo: z.string().optional().nullable(),

//     // esposa
//     nome_completo_esposa: z.string().min(3),
//     email_esposa: z.string().email(),
//     data_nascimento_esposa: z.string().optional().nullable(),
//     profissao_esposa: z.string().optional().nullable(),
//     como_chamar_esposa: z.string().optional().nullable(),
//     igreja_esposa: z.string().optional().nullable(),
//     local_trabalho_esposa: z.string().optional().nullable(),
//     celular_esposa: z.string().optional().nullable(),
//     instagram_esposa: z.string().optional().nullable(),
//     restricoes_alimentares_esposa: z.string().optional().nullable(),
//     medicamentos_alergias_esposa: z.string().optional().nullable(),
//     religiao_esposa: z.string().optional().nullable(),
//     escolaridade_esposa: z.string().optional().nullable(),

//     // casal
//     endereco: z.string().min(3),
//     numero: z.string().optional().nullable(),
//     complemento: z.string().optional().nullable(),
//     bairro: z.string().optional().nullable(),
//     cidade: z.string().min(2),
//     uf: z.string().length(2),
//     cep: z.string().optional().nullable(),

//     data_casamento: z.string().optional().nullable(),
//     telefone_principal: z.string().optional().nullable(),

//     possui_filhos: z.boolean().optional(),
//     quantidade_filhos: z.number().optional().nullable(),
//     grau_parentesco_outro: z.string().optional().nullable(),
//     nome_responsavel_filhos: z.string().optional().nullable(),
//     endereco_responsavel: z.string().optional().nullable(),
//     numero_responsavel: z.string().optional().nullable(),
//     complemento_responsavel: z.string().optional().nullable(),
//     bairro_responsavel: z.string().optional().nullable(),
//     cidade_responsavel: z.string().optional().nullable(),
//     telefone_responsavel: z.string().optional().nullable(),

//     casal_que_convidou: z.string().optional().nullable(),
//     telefone_casal_que_convidou: z.string().optional().nullable(),
// });



// ========================================================
// CRIAR
// ========================================================
export async function criarCadastro(req, res) {
  try {
    // 1. validar arquivo
    if (!req.file) {
      return res.status(400).json({ error: "Foto do casal é obrigatória" });
    }

    // 2. recuperar JSON do FormData
    if (!req.body.data) {
      return res.status(400).json({ error: "Dados do formulário ausentes" });
    }

    const payloadJson = JSON.parse(req.body.data);
    const { esposo, esposa, casal } = payloadJson;

    // 3. validar tipo do arquivo
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Arquivo inválido" });
    }

    // 4. gerar nome do arquivo
    const ext = req.file.originalname.split(".").pop();
    const fileName = `casais/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${ext}`;

    // 5. upload no Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("fotos-casal")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    // 6. gerar URL pública
    const { data: publicUrl } = supabase.storage
      .from("fotos-casal")
      .getPublicUrl(fileName);

    // 7. montar payload do banco
    const payload = {
      // esposo
      nome_completo_esposo: esposo.nomeCompleto,
      data_nascimento_esposo: esposo.dataNascimento,
      profissao_esposo: esposo.profissao,
      como_chamar_esposo: esposo.como_chamar_esposo,
      igreja_esposo: esposo.igreja,
      local_trabalho_esposo: esposo.local_trabalho,
      email_esposo: esposo.email_esposo,
      celular_esposo: esposo.celular,
      redesocial_esposo: esposo.redesocial,
      restricoes_alimentares_esposo: esposo.restricoes_alimentares,
      medicamentos_alergias_esposo: esposo.medicamentos_alergias,
      religiao_esposo: esposo.religiao,
      escolaridade_esposo: esposo.escolaridade,

      // esposa
      nome_completo_esposa: esposa.nomeCompleto,
      data_nascimento_esposa: esposa.dataNascimento,
      profissao_esposa: esposa.profissao,
      como_chamar_esposa: esposa.como_chamar_esposa,
      igreja_esposa: esposa.igreja,
      local_trabalho_esposa: esposa.local_trabalho,
      email_esposa: esposa.email_esposa,
      celular_esposa: esposa.celular,
      redesocial_esposa: esposa.redesocial,
      restricoes_alimentares_esposa: esposa.restricoes_alimentares,
      medicamentos_alergias_esposa: esposa.medicamentos_alergias,
      religiao_esposa: esposa.religiao,
      escolaridade_esposa: esposa.escolaridade,

      // casal
      endereco: casal.endereco,
      cidade: casal.cidade,
      uf: casal.uf,
      data_casamento: casal.dataCasamento,
      possui_conducao: casal.possuiConducao,
      possui_filhos: casal.possuiFilhos,

      quantidade_filhos: casal.possuiFilhos ? casal.quantidade_filhos : null,
      nome_responsavel_filhos: casal.possuiFilhos ? casal.nome_responsavel_filhos : null,
      grau_parentesco_responsavel_filhos: casal.possuiFilhos ? casal.grau_parentesco_responsavel_filhos : null,
      telefone_responsavel: casal.possuiFilhos ? casal.telefone_responsavel : null,
      endereco_responsavel: casal.possuiFilhos ? casal.endereco_responsavel : null,

      // foto
      foto_casal_url: publicUrl.publicUrl
    };

    // 8. salvar no banco
    const { data, error } = await supabase
      .from("cadastro")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 9. resposta final
    return res.status(201).json({
      message: "Cadastro realizado com sucesso",
      data
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}



// ========================================================
// LISTAR
// ========================================================
export async function carregarCadastro(req, res) {
    try {
        const { data, error } = await supabase
            .from("cadastro")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return res.json({ data });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// ========================================================
// BUSCAR POR ID
// ========================================================
export async function buscar(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("cadastro")
            .select("*")
            .eq("id", id)
            .single();

        if (error) return res.status(404).json({ error: "Registro não encontrado" });
        return res.json({ data });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


// ========================================================
// ATUALIZAR
// ========================================================
export async function atualizar(req, res) {
    try {
        const { id } = req.params;
        const parsed = encontristaSchema.partial().parse(req.body);

        const { data, error } = await supabase
            .from("encontrista_inscricao")
            .update(parsed)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        return res.json({
            message: "Inscrição atualizada",
            data
        });

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

// ========================================================
// DELETAR (ADMIN)
// ========================================================
export async function deletar(req, res) {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("encontrista_inscricao")
            .delete()
            .eq("id", id);

        if (error) throw error;

        return res.json({ message: "Inscrição removida com sucesso" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
