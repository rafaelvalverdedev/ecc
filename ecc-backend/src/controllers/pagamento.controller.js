// ========================================
// PAGAMENTO CONTROLLER COMPLETO
// ========================================
import mercadopago from "../config/mercadoPago.js";
import supabase from "../config/supabase.js";

// =============================================================
// 1. GERAR PAGAMENTO PIX DO ENCONTREIRO
// =============================================================
export async function gerarPagamentoEncontreiro(req, res) {
  try {
    const { teamrole_id } = req.params;

    // 1) Buscar vínculo (TeamRole)
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
      return res.status(400).json({ error: "Pessoa não possui e-mail cadastrado." });
    }

    if (valor <= 0) {
      return res.status(400).json({ error: "Valor do pagamento do evento não configurado." });
    }

    // 2) Criar pagamento PIX no Mercado Pago
    const mp = await mercadopago.payment.create({
      transaction_amount: valor,
      description: `Pagamento Encontreiro - ${nome}`,
      payment_method_id: "pix",
      payer: { email },
      notification_url: `${process.env.BASE_URL}/webhook/mercadopago`
    });

    const pagamento = mp.body;

    // 3) Registrar pagamento PENDENTE
    const { error: insertErr } = await supabase
      .from("pagamentos_encontreiro_evento")
      .insert({
        pessoa_id: tr.pessoa_id,
        evento_id: tr.evento_id,
        teamrole_id: tr.id,
        valor: valor,
        metodo: "pix",
        mp_payment_id: pagamento.id,
        pagou: false,
        qr_code_base64: pagamento.point_of_interaction.transaction_data.qr_code_base64
      });

    if (insertErr) {
      console.error(insertErr);
      return res.status(500).json({ error: "Erro ao registrar pagamento." });
    }

    // 4) Retorna somente payment_id para abrir a tela de pagamento
    return res.status(201).json({
      payment_id: pagamento.id
    });

  } catch (err) {
    console.error("ERRO AO GERAR PIX ENCONTREIRO:", err);
    return res.status(500).json({ error: "Erro ao gerar pagamento PIX." });
  }
}

// =============================================================
// 2. RETORNAR QR CODE DO PAGAMENTO
// =============================================================
export async function obterQrCode(req, res) {
  try {
    const { payment_id } = req.params;

    const { data, error } = await supabase
      .from("pagamentos_encontreiro_evento")
      .select("qr_code_base64")
      .eq("mp_payment_id", payment_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Pagamento não encontrado." });
    }

    return res.json({
      qr_code_base64: data.qr_code_base64
    });

  } catch (err) {
    console.error("ERRO AO OBTER QR CODE:", err);
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
    return res.status(500).json({ error: "Erro ao verificar status" });
  }
}

// =============================================================
// 4. WEBHOOK MERCADO PAGO — CONFIRMA PAGAMENTO
// =============================================================
export async function webhookMercadoPago(req, res) {
  try {
    const body = JSON.parse(req.body.toString());

    if (!body.data?.id) {
      return res.status(200).send("Webhook ignorado");
    }

    const paymentId = body.data.id;

    // Buscar status real
    const mpRes = await mercadopago.payment.findById(paymentId);
    const pagamento = mpRes.body;

    const status = pagamento.status;

    console.log("WEBHOOK RECEBIDO:", status);

    // Atualiza tabela pagamentos_encontreiro_evento
    await supabase
      .from("pagamentos_encontreiro_evento")
      .update({ pagou: status === "approved" })
      .eq("mp_payment_id", paymentId);

    // Se aprovado → atualizar TeamRole.pagou
    if (status === "approved") {
      await supabase
        .from("teamrole")
        .update({ pagou: true })
        .eq("id", pagamento.external_reference);
    }

    return res.status(200).send("OK");

  } catch (err) {
    console.error("ERRO WEBHOOK:", err);
    return res.status(500).send("Erro webhook");
  }
}
