import { mpPayment } from "../config/mercadoPago.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ===========================
// HELPERS
// ===========================
async function getInscricao(inscricaoId) {
  const { data, error } = await supabase
    .from("inscricoes")
    .select("*")
    .eq("id", inscricaoId)
    .single();

  if (error || !data) {
    throw new Error("Inscrição não encontrada");
  }

  return data;
}

// ===========================
// CRIAR PAGAMENTO PIX
// ===========================
export async function criarPagamentoPix(req, res) {
  try {
    const inscricaoId = req.params.id;
    const { payer } = req.body;

    const inscricao = await getInscricao(inscricaoId);
    const amount = Number(inscricao.valor);

    const body = {
      transaction_amount: amount,
      description: `Inscrição evento ${inscricao.evento_id}`,
      payment_method_id: "pix",
      external_reference: inscricao.id,
      payer
    };

    const payment = await mpPayment.create({ body });

    // salvar no banco
    const { data: pagamentoDB, error: pgError } = await supabase
      .from("pagamentos_inscricao")
      .insert({
        inscricao_id: inscricao.id,
        gateway: "MERCADO_PAGO",
        mp_payment_id: payment.id.toString(),
        mp_status: payment.status,
        mp_status_detail: payment.status_detail,
        metodo: "pix",
        valor: amount,
        raw_payload: payment
      })
      .select()
      .single();

    if (pgError) throw pgError;

    return res.status(201).json({
      pagamento: pagamentoDB,
      pix: payment.point_of_interaction?.transaction_data || null
    });
  } catch (err) {
    console.error("Erro PIX:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ===========================
// CRIAR PAGAMENTO CARTÃO
// ===========================
export async function criarPagamentoCartao(req, res) {
  try {
    const inscricaoId = req.params.id;
    const {
      token,
      installments,
      payment_method_id,
      payer,
      tipo_cartao
    } = req.body;

    const inscricao = await getInscricao(inscricaoId);
    const amount = Number(inscricao.valor);

    const body = {
      transaction_amount: amount,
      description: `Inscrição evento ${inscricao.evento_id}`,
      token,
      installments: installments || 1,
      payment_method_id,
      external_reference: inscricao.id,
      payer
    };

    const payment = await mpPayment.create({ body });

    const { data: pagamentoDB, error: pgError } = await supabase
      .from("pagamentos_inscricao")
      .insert({
        inscricao_id: inscricao.id,
        gateway: "MERCADO_PAGO",
        mp_payment_id: payment.id.toString(),
        mp_status: payment.status,
        mp_status_detail: payment.status_detail,
        metodo: tipo_cartao || "credit_card",
        valor: amount,
        raw_payload: payment
      })
      .select()
      .single();

    if (pgError) throw pgError;

    return res.status(201).json({
      pagamento: pagamentoDB,
      status: payment.status,
      status_detail: payment.status_detail
    });
  } catch (err) {
    console.error("Erro CARTÃO:", err);
    return res.status(500).json({ error: err.message });
  }
}
