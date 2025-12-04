import { Router } from "express";
import {
  criarPagamentoPix,
  criarPagamentoCartao
} from "../controllers/pagamento.controller.js";

const router = Router();

router.post("/inscricoes/:id/pagamentos/pix", criarPagamentoPix);
router.post("/inscricoes/:id/pagamentos/cartao", criarPagamentoCartao);

export default router;
