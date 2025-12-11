// =============================================================
// 4. WEBHOOK OFICIAL DO MERCADO PAGO (VERSÃO FINAL)
// =============================================================
export async function webhookMercadoPago(req, res) {
  try {
    let body;

    try {
      if (Buffer.isBuffer(req.body)) {
        body = JSON.parse(req.body.toString());
      } else if (typeof req.body === "string") {
        body = JSON.parse(req.body);
      } else if (typeof req.body === "object") {
        body = req.body; // já está parseado
      } else {
        throw new Error("Formato inesperado no webhook");
      }
    } catch (e) {
      console.error("ERRO AO PARSEAR WEBHOOK:", e);
      return res.status(400).send("INVALID JSON");
    }

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
    const teamroleId = pagamento.external_reference;  // ESSENCIAL!

    // Atualiza tabela de pagamentos
    await supabase
      .from("pagamentos_encontreiro_evento")
      .update({
        pagou: status === "approved",
        data_pagamento: status === "approved" ? new Date() : null
      })
      .eq("mp_payment_id", paymentId);

    // Se aprovado → atualizar teamrole
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
