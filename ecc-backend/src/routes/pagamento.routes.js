import { Router } from "express";
import { gerarPagamentoPix } from "../controllers/pagamento.controller.js";
import { gerarPagamentoEncontreiro } from "../controllers/pagamento.controller.js";

const router = Router();

router.post("/inscricoes/:inscricao_id/pagamentos/pix", gerarPagamentoPix);
router.post("/encontreiro/:teamrole_id", authMiddleware, gerarPagamentoEncontreiro);

export default router;
