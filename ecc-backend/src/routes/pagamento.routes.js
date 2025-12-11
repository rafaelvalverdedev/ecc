import { Router } from "express";
import {
  gerarPagamentoEncontreiro,
  obterQrCode,
  verificarStatusPagamento
} from "../controllers/pagamento.controller.js";

const router = Router();

// gerar pagamento encontreiro
router.post("/encontreiro/:teamrole_id", gerarPagamentoEncontreiro);

// retornar QR Code
router.get("/qrcode/:payment_id", obterQrCode);

// verificar status
router.get("/status/:payment_id", verificarStatusPagamento);

export default router;
