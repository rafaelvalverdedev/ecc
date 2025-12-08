import supabase from "../config/supabase.js";
import mercadopago from "mercadopago";

// Evitar processar o mesmo pagamento 2x
const processedEvents = new Set();

export async function mpWebhook(req, res) {
  try {
    const { type, data } = req.body;

    if (!type || !data?.id) {
      console.warn("⚠ Webhook inválido:", req.body);
      return res.sendStatus(400);
    }

    const paymentId = data.id.toString();

    if (processedEvents.has(paymentId)) {
      console.log("⚠ Evento já processado:", paymentId);
      return res.status(200).json({ message: "Evento duplicado ignorado" });
    }

    console.log("🔔 Webhook recebido:", type, paymentId);

    const result = await mercadopago.payment.get(paymentId);
    const p = result.response;

    const status = p.status; // approved, pending, rejected...
    const externalReference = p.external_reference; // usamos como inscricao_id

    if (!externalReference) {
      console.error("❌ Pagamento sem external_reference!");
      return res.sendStatus(400);
    }

    processedEvents.add(paymentId);

    // Atualiza registro de pagamento
    await supabase
      .from("pagamentos_inscricao")
      .update({
        mp_status: status,
        mp_status_detail: p.status_detail,
        raw_payload: p
      })
      .eq("mp_payment_id", paymentId);

    // Se aprovado → marcar inscrição como CONFIRMADA
    if (status === "approved") {
      const { error } = await supabase
        .from("inscricoes")
        .update({ status: "confirmed" })
        .eq("id", externalReference);

      if (error) {
        console.error("❌ Erro ao atualizar inscrição:", error);
      } else {
        console.log(`🎉 Inscrição ${externalReference} marcada como CONFIRMED!`);
      }
    }

    console.log("✅ Webhook finalizado com sucesso.");
    return res.status(200).json({ message: "OK" });

  } catch (error) {
    console.error("❌ Erro no Webhook:", error);
    return res.sendStatus(500);
  }
}
