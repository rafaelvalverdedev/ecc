import { Router } from "express";
import {
  criarEncontristaInscricao,
  listarEncontristaInscricoes,
  buscarEncontristaInscricao,
  atualizarEncontristaInscricao,
  deletarEncontristaInscricao
} from "../controllers/encontristaInscricao.controller.js";

const router = Router();

router.post("/", criarEncontristaInscricao);
router.get("/", listarEncontristaInscricoes);
router.get("/:id", buscarEncontristaInscricao);

router.put("/:id", atualizarEncontristaInscricao);

router.delete("/:id", deletarEncontristaInscricao);

export default router;
