import { Router } from "express";
import { mercadoPagoWebhook } from "../controllers/webhook.controller.js";
import bodyParser from "body-parser";

const router = Router();

router.post(
  "/mercadopago",
  bodyParser.raw({ type: "*/*" }),
  mercadoPagoWebhook
);

export default router;
