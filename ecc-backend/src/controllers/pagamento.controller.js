import mercadopago from "../config/mercadoPago.js";
import supabase from "../config/supabase.js";

// Gera pagamento PIX (PRODUÇÃO)
export async function gerarPagamentoPix(req, res) {
  try {
    const { inscricao_id } = req.params;
    const { payer } = req.body;

    console.log("📌 Dados recebidos:", req.body);

    // Apenas email é obrigatório
    if (!payer || !payer.email) {
      return res.status(400).json({
        error: "payer.email é obrigatório para gerar PIX."
      });
    }

    // Buscar inscrição
    const { data: inscricao, error } = await supabase
      .from("inscricoes")
      .select("id, valor")
      .eq("id", inscricao_id)
      .single();

    if (error || !inscricao)
      return res.status(404).json({ error: "Inscrição não encontrada" });

    console.log("📌 Inscrição:", inscricao);

    // Criar pagamento PIX
    const response = await mercadopago.payment.create({
      transaction_amount: inscricao.valor,
      description: `Pagamento inscrição ${inscricao.id}`,
      payment_method_id: "pix",

      payer: {
        email: payer.email
        // Nenhuma identificação extra
      },

      notification_url: "https://ecc-backend-8i9l.onrender.com/webhook/mercadopago"
    });

    const pagamento = response.body;
    console.log("📌 PIX criado:", pagamento);

    await supabase.from("pagamentos").insert({
      inscricao_id,
      gateway: "MERCADO_PAGO",
      mp_payment_id: pagamento.id,
      metodo: "pix",
      valor: inscricao.valor,
      moeda: "BRL",
      status: pagamento.status
    });

    return res.status(201).json({
      qr_code_base64:
        pagamento.point_of_interaction.transaction_data.qr_code_base64,
      payment_id: pagamento.id
    });

  } catch (err) {
    console.error("❌ ERRO AO GERAR PIX:", err);
    return res.status(500).json({ error: "Erro ao gerar pagamento" });
  }
}
