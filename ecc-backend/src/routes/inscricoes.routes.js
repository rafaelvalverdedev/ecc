import { Router } from "express";
import {
  criarInscricao,
  atualizarInscricao,
} from "../controllers/inscricoes.controller.js";

const router = Router();

router.post("/", criarInscricao);
router.put("/:id", atualizarInscricao);

export default router;
