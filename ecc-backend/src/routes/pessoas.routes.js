import { Router } from "express";
import {
  listarPessoas,
  buscarPessoa,
  buscarPessoaPorEmail,
  criarPessoa,
  atualizarPessoa,
  atualizarSenha,
  deletarPessoa,
  deletarPessoaPorEmail
} from "../controllers/pessoas.controller.js";

import { authMiddleware, requireRole, Roles } from "../middlewares/auth.js";

const router = Router();

// públicas
router.get("/", listarPessoas);
router.get("/:id", buscarPessoa);
router.get("/email/:email", buscarPessoaPorEmail);

// requer login
router.post("/", authMiddleware, criarPessoa);
router.put("/:id", authMiddleware, atualizarPessoa);
router.patch("/:id/senha", authMiddleware, atualizarSenha);

// apenas admin
router.delete("/:id", authMiddleware, requireRole(Roles.ADMIN), deletarPessoa);
router.delete("/email/:email", authMiddleware, requireRole(Roles.ADMIN), deletarPessoaPorEmail);

export default router;
