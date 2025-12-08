import supabase from "../config/supabase.js";
import mercadopago from "mercadopago";

// Evitar processar o mesmo pagamento 2x
const processedEvents = new Set();

export async function mpWebhook(req, res) {
  try {
    console.log("🌐 Webhook recebido:", req.body);

    const { type, data, action } = req.body;

    // Se for simulação do Mercado Pago → só retorna 200
    if (req.body.api_version && action?.includes("test")) {
      console.log("🧪 Simulação recebida. Ignorando.");
      return res.sendStatus(200);
    }

    if (type !== "payment" || !data?.id) {
      console.log("❌ Webhook inválido:", req.body);
      return res.sendStatus(200); // Retornar 200 evita novas tentativas
    }

    // Buscar dados reais do pagamento
    const payment = await mercadopago.payment.findById(data.id);

    console.log("💰 Pagamento real encontrado:", payment.body.status);

    // Caso seja aprovado
    if (payment.body.status === "approved") {
      await atualizarPagamento(data.id);
    }

    return res.sendStatus(200);

  } catch (err) {
    console.error("🚨 Erro no webhook:", err);
    return res.sendStatus(200); // NUNCA retornar 500 para Mercado Pago
  }
}

