import { Router } from "express";
import { gerarPagamentoPix } from "../controllers/pagamento.controller.js";

const router = Router();

router.post("/inscricoes/:inscricao_id/pagamentos/pix", gerarPagamentoPix);

export default router;
