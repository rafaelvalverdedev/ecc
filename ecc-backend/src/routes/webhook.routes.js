import express from "express";
import { mpWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

// Rota usada pelo mercado pago para enviar notificações
router.post("/mercadopago", express.json({ type: "*/*" }), mpWebhook);

export default router;
