import { Router } from "express";
import {
  listarInscricoes,
  listarPorPessoa,
  listarPorEvento,
  buscarInscricao,
  criarInscricao,
  atualizarInscricao,
  cancelarInscricao,
  deletarInscricao,
  obterInscricaoPorId,
  verificarStatusInscricao 
} from "../controllers/inscricoes.controller.js";

import { authMiddleware } from "../middlewares/auth.js";
import { requireRole, Roles } from "../middlewares/auth.js";

const router = Router();

// listagens
router.get("/", listarInscricoes);
router.get("/:id", buscarInscricao);
router.get("/pessoa/:pessoaId", listarPorPessoa);
router.get("/evento/:eventoId", listarPorEvento);
router.get("/:id", obterInscricaoPorId);


// 🔓 ROTAS PÚBLICAS (SEM TOKEN)
router.get("/:id/status", verificarStatusInscricao);

// criação e edição (requer login)
router.post("/", authMiddleware, criarInscricao);
router.put("/:id", atualizarInscricao);
router.patch("/:id/cancelar", authMiddleware, cancelarInscricao);

// somente admin pode remover
router.delete("/:id", authMiddleware, requireRole(Roles.ADMIN), deletarInscricao);

export default router;
