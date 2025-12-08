import mercadopago from "../config/mercadoPago.js";
import supabase from "../config/supabase.js";

// Gera pagamento PIX
export async function gerarPagamentoPix(req, res) {
  try {
    const { inscricao_id } = req.params;

    // Buscar valor da inscrição
    const { data: inscricao } = await supabase
      .from("inscricoes")
      .select("id, valor")
      .eq("id", inscricao_id)
      .single();

    if (!inscricao)
      return res.status(404).json({ error: "Inscrição não encontrada" });

    // Criar pagamento PIX
    const response = await mercadopago.payment.create({
      transaction_amount: inscricao.valor,
      description: `Pagamento inscrição ${inscricao.id}`,
      payment_method_id: "pix"
    });

    const pagamento = response.body;

    // Salvar no banco
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
      qr_code_base64: pagamento.point_of_interaction.transaction_data.qr_code_base64,
      payment_id: pagamento.id
    });

  } catch (err) {
    console.error("ERRO AO GERAR PIX:", err);
    return res.status(500).json({ error: "Erro ao gerar pagamento" });
  }
}
