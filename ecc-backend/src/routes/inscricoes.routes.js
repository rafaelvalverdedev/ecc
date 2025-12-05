import { Router } from "express";
import {
  criarInscricao,
  atualizarInscricao,
  listarInscricoes
} from "../controllers/inscricoes.controller.js";

const router = Router();

router.post("/", criarInscricao);
router.put("/:id", atualizarInscricao);
router.get("/", listarInscricoes);
export default router;
