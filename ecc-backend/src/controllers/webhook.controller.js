import supabase from "../config/supabase.js";
import mercadopago from "mercadopago";

// auxilia evitar que o mesmo evento seja processado mais de 1 vez
const processedEvents = new Set();

export async function mpWebhook(req, res) {
  try {
    const { type, data } = req.body;

    if (!type || !data?.id) {
      console.warn("⚠ Webhook inválido:", req.body);
      return res.sendStatus(400);
    }

    const paymentId = data.id;

    if (processedEvents.has(paymentId)) {
      console.log("⚠ Evento já processado:", paymentId);
      return res.status(200).json({ message: "Evento duplicado ignorado" });
    }

    console.log("🔔 Webhook recebido:", type, paymentId);

    const result = await mercadopago.payment.get(paymentId);
    const p = result.response;

    const status = p.status; // approved, pending, rejected
    const externalReference = p.external_reference;

    if (!externalReference) {
      console.error("❌ Pagamento sem external_reference!");
      return res.sendStatus(400);
    }

    processedEvents.add(paymentId);

    // Atualiza pagamento
    await supabase
      .from("pagamentos_inscricao")
      .update({
        mp_status: status,
        mp_status_detail: p.status_detail
      })
      .eq("mp_payment_id", paymentId);

    // Se aprovado → atualiza inscrição
    if (status === "approved") {
      await supabase
        .from("inscricoes")
        .update({ status: "pago" })
        .eq("id", externalReference);

      console.log(`🎉 Inscrição ${externalReference} marcada como PAGA!`);
    }

    console.log("✅ Webhook finalizado com sucesso.");
    return res.status(200).json({ message: "OK" });

  } catch (error) {
    console.error("❌ Erro no Webhook:", error);
    return res.sendStatus(500);
  }
}