import { Router } from "express";
import {
  gerarPagamentoEncontreiro,
  obterQrCode,
  verificarStatusPagamento,
  webhookMercadoPago
} from "../controllers/pagamento.controller.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// gerar pagamento do encontreiro
router.post("/encontreiro/:teamrole_id", authMiddleware, gerarPagamentoEncontreiro);

// obter QR Code
router.get("/qrcode/:payment_id", authMiddleware, obterQrCode);

// verificar status
router.get("/status/:payment_id", authMiddleware, verificarStatusPagamento);

// webhook (público)
router.post("/mercadopago", webhookMercadoPago);

export default router;
