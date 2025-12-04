import { mpPayment } from "../config/mercadoPago.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function mercadoPagoWebhook(req, res) {
  try {
    const { type, data } = req.body;

    if (type !== "payment" || !data?.id) {
      return res.status(200).json({ message: "ignorado" });
    }

    const paymentId = data.id.toString();

    // Carregar pagamento completo
    const payment = await mpPayment.get({ id: paymentId });

    // Atualizar tabela
    const { data: registro, error } = await supabase
      .from("pagamentos_inscricao")
      .update({
        mp_status: payment.status,
        mp_status_detail: payment.status_detail,
        raw_payload: payment
      })
      .eq("mp_payment_id", paymentId)
      .select()
      .single();

    if (error) console.error(error);

    // Se APROVADO → marcar inscrição como paga
    if (payment.status === "approved") {
      await supabase
        .from("inscricoes")
        .update({ status: "PAGA" })
        .eq("id", registro.inscricao_id);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook erro:", err);
    return res.status(200).json({ error: err.message });
  }
}
