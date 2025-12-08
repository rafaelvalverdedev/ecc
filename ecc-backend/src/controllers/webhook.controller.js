import crypto from "crypto";
import mercadopago from "mercadopago";
import supabase from "../config/supabase.js";

mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN, });


/**
 * Função para validar a assinatura do Mercado Pago
 */
function validarAssinatura(req) {
  try {
    const mpSignature = req.headers["x-signature"];
    const mpRequestId = req.headers["x-request-id"];

    if (!mpSignature || !mpRequestId) return false;

    const [tsPart, hashPart] = mpSignature.split(",");
    const ts = tsPart.replace("ts=", "");
    const v1 = hashPart.replace("v1=", "");

    // Expiração de 5 minutos
    const agora = Math.floor(Date.now() / 1000);
    if (Math.abs(agora - parseInt(ts)) > 300) {
      console.log("⚠ Assinatura expirada");
      return false;
    }

    const dadosAssinatura = `id:${mpRequestId};ts:${ts};`;
    const hashEsperado = crypto
      .createHmac("sha256", process.env.MP_WEBHOOK_SECRET)
      .update(dadosAssinatura)
      .digest("hex");

    return hashEsperado === v1;

  } catch (err) {
    console.log("⚠ Erro validando assinatura:", err);
    return false;
  }
}

/**
 * Webhook principal do Mercado Pago
 */
export async function mpWebhook(req, res) {
  try {
    console.log("\n\n📩 NOVO WEBHOOK RECEBIDO");
    console.log("Body:", JSON.stringify(req.body, null, 2));

    // 1 — Validar assinatura
    const assinaturaValida = validarAssinatura(req);
    if (!assinaturaValida) {
      console.log("❌ Assinatura inválida — ignorando");
      return res.sendStatus(200);
    }

    const { type, data, action } = req.body;

    // 2 — Ignorar simulações
    if (req.body.live_mode === false) {
      console.log("🧪 Webhook de teste detectado — ignorando");
      return res.sendStatus(200);
    }

    // 3 — Usamos apenas eventos reais de pagamento
    if (type !== "payment" || !data?.id) {
      console.log("⚠ Webhook ignorado — não é pagamento válido");
      return res.sendStatus(200);
    }

    const paymentId = data.id;
    console.log("🔍 Buscando pagamento real:", paymentId);

    // 4 — Consultar pagamento REAL no Mercado Pago
    const resultado = await mercadopago.payment.findById(paymentId);
    const pagamento = resultado.body;

    console.log("📌 Status do pagamento:", pagamento.status);

    // 5 — Impedir duplicações
    const { data: pagExistente } = await supabase
      .from("pagamentos")
      .select("id, status")
      .eq("mp_payment_id", paymentId)
      .maybeSingle();

    if (pagExistente && pagExistente.status === pagamento.status) {
      console.log("⏩ Pagamento já processado antes — ignorando");
      return res.sendStatus(200);
    }

    // 6 — Atualizar pagamento no banco
    await supabase
      .from("pagamentos")
      .update({
        status: pagamento.status,
        raw_payload: pagamento,
      })
      .eq("mp_payment_id", paymentId);

    console.log("💾 Pagamento atualizado no banco:", pagamento.status);

    // 7 — Se aprovado → atualizar inscrição
    if (pagamento.status === "approved") {
      await supabase
        .from("inscricoes")
        .update({ status: "pago" })
        .eq("id", pagamento.external_reference);

      console.log("🎉 Inscrição marcada como PAGA!");
    }

    return res.sendStatus(200);

  } catch (err) {
    console.log("🚨 ERRO NO WEBHOOK:", err);
    return res.sendStatus(200); // Nunca retornar 500
  }
}
