import mercadopago from "mercadopago";
import { supabase } from "../supabase.js";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

// ========================================
//  GERAR PAGAMENTO PIX (ENCONTREIRO)
// ========================================
export async function gerarPagamentoEncontreiro(req, res) {
  const { teamrole_id, pessoa_id, evento_id, valor } = req.body;

  try {
    const preference = {
      transaction_amount: Number(valor),
      description: "Pagamento Encontreiro",
      payment_method_id: "pix",
      external_reference: teamrole_id,
      notification_url: `${process.env.BASE_URL}/webhook/mercadopago`
    };

    console.log("URL DE NOTIFICAÇÃO ENVIADA:", preference.notification_url);

    const mpRes = await mercadopago.payment.create(preference);
    const pagamento = mpRes.body;

    // Salvar no banco
    await supabase.from("pagamentos_encontreiro_evento").insert([
      {
        pessoa_id,
        evento_id,
        teamrole_id,
        pagou: false,
        valor,
        metodo: "pix",
        mp_payment_id: pagamento.id,
        qr_code_base64: pagamento.point_of_interaction.transaction_data.qr_code_base64
      }
    ]);

    return res.status(200).json({
      qr_base64: pagamento.point_of_interaction.transaction_data.qr_code_base64,
      payment_id: pagamento.id
    });

  } catch (err) {
    console.error("ERRO AO GERAR PIX:", err);
    return res.status(500).json({ error: "Erro ao gerar pagamento PIX." });
  }
}

// ========================================
//  WEBHOOK OFICIAL MERCADO PAGO
// ========================================
export async function webhookMercadoPago(req, res) {
  console.log("=== WEBHOOK RECEBIDO ===");

  let body;

  try {
    // SUPORTE A RAW, STRING E JSON
    if (Buffer.isBuffer(req.body)) {
      body = JSON.parse(req.body.toString());
    } else if (typeof req.body === "string") {
      body = JSON.parse(req.body);
    } else if (typeof req.body === "object") {
      body = req.body; // já parseado
    } else {
      throw new Error("Formato inesperado de req.body");
    }

  } catch (err) {
    console.error("ERRO AO PARSEAR WEBHOOK:", err);
    console.error("CORPO RECEBIDO:", req.body);
    return res.status(400).send("INVALID JSON");
  }

  console.log("WEBHOOK BODY:", body);

  try {
    // Mercado Pago envia: { action, data: { id } }
    if (!body.data?.id) {
      return res.status(200).send("OK");
    }

    const paymentId = body.data.id;

    // Buscar dados completos do pagamento
    const pagamentoMP = await mercadopago.payment.findById(paymentId);
    const pagamento = pagamentoMP.body;

    const status = pagamento.status; // example: approved
    const teamroleId = pagamento.external_reference;

    console.log("STATUS DO PAGAMENTO:", status);
    console.log("TEAMROLE REFERÊNCIA:", teamroleId);

    // Atualizar registro de pagamento
    await supabase
      .from("pagamentos_encontreiro_evento")
      .update({
        pagou: status === "approved",
        data_pagamento: status === "approved" ? new Date() : null,
        mp_status: status
      })
      .eq("mp_payment_id", paymentId);

    // Atualizar tabela teamrole
    if (status === "approved") {
      await supabase
        .from("teamrole")
        .update({ pagou: true })
        .eq("id", teamroleId);

      console.log("PAGAMENTO APROVADO → TEAMROLE ATUALIZADO.");
    }

    return res.status(200).send("OK");

  } catch (err) {
    console.error("ERRO NO PROCESSAMENTO DO WEBHOOK:", err);
    return res.status(500).send("Erro ao processar webhook.");
  }
}
