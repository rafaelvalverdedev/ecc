import express from "express";
import { mpWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

// NÃO usar express.json() aqui!
router.post("/mercadopago", mpWebhook);

export default router;
