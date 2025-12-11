// ========================================
// PAGAMENTO ENCONTREIRO (PIX)
// ========================================
import mercadopago from "../config/mercadoPago.js";
import supabase from "../config/supabase.js";

export async function gerarPagamentoEncontreiro(req, res) {
  try {
    const { teamrole_id } = req.params;

    // 1) Buscar vínculo (teamrole)
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
      return res.status(404).json({ error: "Vínculo (teamrole) não encontrado." });
    }

    const email = tr.pessoa?.email;
    const nome = tr.pessoa?.nome;
    const valor = Number(tr.evento?.valor_encontreiro || 0);

    if (!email) {
      return res.status(400).json({ error: "Pessoa não possui e-mail cadastrado." });
    }

    if (!valor || valor <= 0) {
      return res.status(400).json({ error: "Valor de encontro inválido para o evento." });
    }

    // 2) Criar pagamento PIX no Mercado Pago
    const mpResponse = await mercadopago.payment.create({
      transaction_amount: valor,
      description: `Pagamento Encontreiro - ${nome}`,
      payment_method_id: "pix",
      payer: {
        email
      },
      notification_url: `${process.env.BASE_URL}/webhook/mercadopago`
    });

    const pagamento = mpResponse.body;

    // 3) Registrar pagamento pendente
    await supabase.from("pagamentos_encontreiro_evento").insert({
      pessoa_id: tr.pessoa_id,
      evento_id: tr.evento_id,
      teamrole_id: tr.id,
      valor: valor,
      metodo: "pix",
      mp_payment_id: pagamento.id,
      pagou: false
    });

    // 4) Retornar QR CODE para o frontend
    return res.status(201).json({
      qr_code_base64:
        pagamento.point_of_interaction.transaction_data.qr_code_base64,
      payment_id: pagamento.id
    });

  } catch (err) {
    console.error("ERRO AO GERAR PIX ENCONTREIRO:", err);
    return res.status(500).json({ error: "Erro ao gerar pagamento PIX." });
  }
}
