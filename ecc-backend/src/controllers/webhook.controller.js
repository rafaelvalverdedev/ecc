import mercadopago from "../config/mercadoPago.js";
import supabase from "../config/supabase.js";

export async function mercadoPagoWebhook(req, res) {
  try {
    const body = JSON.parse(req.body.toString()); // porque é raw

    console.log("📩 WEBHOOK RECEBIDO:", body);

    if (!body.data || !body.data.id)
      return res.status(200).send("Webhook ignorado");

    const paymentId = body.data.id;

    // Buscar pagamento real no MP
    const mpResponse = await mercadopago.payment.findById(paymentId);
    const pagamentoMP = mpResponse.body;

    console.log("🔍 Status Mercado Pago:", pagamentoMP.status);

    // Atualizar pagamento
    await supabase
      .from("pagamentos")
      .update({ status: pagamentoMP.status })
      .eq("mp_payment_id", paymentId);

    // Se aprovado → atualizar inscrição
    if (pagamentoMP.status === "approved") {
      await supabase
        .from("inscricoes")
        .update({ status: "confirmada" })
        .eq("id", pagamentoMP.external_reference);
    }

    return res.status(200).send("OK");

  } catch (err) {
    console.error("❌ ERRO WEBHOOK:", err);
    return res.status(500).send("Erro webhook");
  }
}
