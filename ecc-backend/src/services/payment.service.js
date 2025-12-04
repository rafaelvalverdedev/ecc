// src/services/payment.service.js
import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export async function createPixPayment({ amount, description, payer }) {
  const res = await mercadopago.payment.create({
    transaction_amount: Number(amount),
    description,
    payment_method_id: "pix",
    payer
  });

  return res.body;
}

export async function createCardPayment({ amount, token, description, payer, installments = 1 }) {
  const res = await mercadopago.payment.create({
    transaction_amount: Number(amount),
    token,
    installments,
    description,
    payment_method_id: "visa", // o MP detecta automaticamente
    payer
  });

  return res.body;
}
