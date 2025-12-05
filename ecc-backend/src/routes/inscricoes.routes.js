import { Router } from "express";
import {
  criarInscricao,
  atualizarInscricao,
  listarInscricoes,
  buscarInscricao,
  deletarInscricao
} from "../controllers/inscricoes.controller.js";

const router = Router();

// Criar inscrição
router.post("/", criarInscricao);

// Atualizar inscrição
router.put("/:id", atualizarInscricao);

// Listar todas
router.get("/", listarInscricoes);

// Buscar inscrição específica
router.get("/:id", buscarInscricao);

// DELETAR inscrição (FALTAVA)
router.delete("/:id", deletarInscricao);

export default router;
