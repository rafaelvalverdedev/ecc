import mercadopago from "../config/mercadoPago.js";
import supabase from "../config/supabase.js";

// =============================================================
// 1. GERAR PAGAMENTO PIX DO ENCONTREIRO (VERSÃO FINAL)
// =============================================================
export async function gerarPagamentoEncontreiro(req, res) {
  try {
    const { teamrole_id } = req.params;

    console.log("Gerando PIX para teamrole:", teamrole_id);

    // 1) Buscar vínculo
    const { data: tr, error: trError } = await supabase
      .from("teamrole")
      .select(`
        id,
        pessoa_id,
        evento_id,
        pessoa:pessoa_id (nome, email),
        evento:evento_id (nome, valor_encontreiro)
      `)
      .eq("id", teamrole_id)
      .single();

    if (trError || !tr) {
      return res.status(404).json({ error: "Vínculo do encontreiro não encontrado." });
    }

    const nome = tr.pessoa?.nome || "Encontreiro";
    const email = tr.pessoa?.email;
    const valor = Number(tr.evento?.valor_encontreiro || 0);

    if (!email) {
      return res.status(400).json({ error: "Pessoa sem e-mail cadastrado." });
    }

    if (valor <= 0) {
      return res.status(400).json({ error: "Valor do evento inválido." });
    }


    // URL que será enviada ao Mercado Pago (para debug)
    console.log(
      "URL DE NOTIFICAÇÃO ENVIADA:",
      `${process.env.BASE_URL}/webhook/mercadopago`
    );


    // =========================================================
    // 2. Criar pagamento PIX com external_reference
    // =========================================================
    const mp = await mercadopago.payment.create({
      transaction_amount: valor,
      description: `Pagamento Encontreiro - ${nome}`,
      payment_method_id: "pix",
      payer: { email },

      // ESSENCIAL PARA O WEBHOOK FUNCIONAR
      external_reference: tr.id,

      notification_url: `${process.env.BASE_URL}/webhook/mercadopago`
    });

    const pagamento = mp.body;

    console.log("Pagamento MP criado:", pagamento.id);

    // =========================================================
    // 3. Registrar pagamento no banco
    // =========================================================
    const { error: insertErr } = await supabase
      .from("pagamentos_encontreiro_evento")
      .insert({
        pessoa_id: tr.pessoa_id,
        evento_id: tr.evento_id,
        teamrole_id: tr.id,
        valor,
        metodo: "pix",
        mp_payment_id: pagamento.id,
        pagou: false,
        qr_code_base64: pagamento.point_of_interaction.transaction_data.qr_code_base64,
        qr_code: pagamento.point_of_interaction.transaction_data.qr_code
      });

    if (insertErr) {
      console.error("Erro ao salvar pagamento:", insertErr);
      return res.status(500).json({ error: "Erro ao registrar pagamento." });
    }

    // 4) Resposta final
    return res.status(201).json({
      payment_id: pagamento.id
    });

  } catch (err) {
    console.error("ERRO AO GERAR PIX ENCONTREIRO:",
      err.response?.body || err);
    return res.status(500).json({ error: "Erro ao gerar pagamento PIX." });
  }
}

// =============================================================
// 2. OBTER O QR CODE BASE64 DO PAGAMENTO
// =============================================================
export async function obterQrCode(req, res) {
  try {
    const { payment_id } = req.params;

    const { data, error } = await supabase
      .from("pagamentos_encontreiro_evento")
      .select("qr_code_base64, qr_code")
      .eq("mp_payment_id", payment_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "QR Code não encontrado." });
    }

    return res.json({
      qr_code_base64: data.qr_code_base64,
      qr_code: data.qr_code
    });
    
  } catch (err) {
    console.error("ERRO AO BUSCAR QR CODE:", err);
    return res.status(500).json({ error: "Erro ao carregar QR Code." });
  }
}

// =============================================================
// 3. CONSULTAR STATUS DO PAGAMENTO
// =============================================================
export async function verificarStatusPagamento(req, res) {
  try {
    const { payment_id } = req.params;

    const mpRes = await mercadopago.payment.findById(payment_id);
    const pagamento = mpRes.body;

    return res.json({
      status: pagamento.status
    });

  } catch (err) {
    console.error("ERRO AO VERIFICAR STATUS:", err);
    return res.status(500).json({ error: "Erro ao verificar status." });
  }
}

// =============================================================
// 4. WEBHOOK OFICIAL DO MERCADO PAGO (VERSÃO FINAL)
// =============================================================
export async function webhookMercadoPago(req, res) {
  try {
    const body = JSON.parse(req.body.toString());
    console.log("WEBHOOK RECEBIDO:", body);

    if (!body.data?.id) {
      return res.status(200).send("OK");
    }

    const paymentId = body.data.id;

    // Buscar status real no Mercado Pago
    const mpRes = await mercadopago.payment.findById(paymentId);
    const pagamento = mpRes.body;

    console.log("Status do pagamento:", pagamento.status);

    const status = pagamento.status;
    const teamroleId = pagamento.external_reference; // ESSENCIAL!

    // Atualiza tabela de pagamentos
    await supabase
      .from("pagamentos_encontreiro_evento")
      .update({
        pagou: status === "approved",
        data_pagamento: status === "approved" ? new Date() : null
      })
      .eq("mp_payment_id", paymentId);

    // Se aprovado → atualizar teamrole.pagou
    if (status === "approved") {
      await supabase
        .from("teamrole")
        .update({ pagou: true })
        .eq("id", teamroleId);

      console.log("Pagamento aprovado! Teamrole atualizado:", teamroleId);
    }

    return res.status(200).send("OK");

  } catch (err) {
    console.error("ERRO NO WEBHOOK:", err.response?.body || err);
    return res.status(500).send("Erro no webhook");
  }
}
