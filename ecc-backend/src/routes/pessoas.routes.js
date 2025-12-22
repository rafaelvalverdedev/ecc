import { Router } from "express";
import {
  listarPessoas,
  buscarPessoa,
  criarPessoa,
  atualizarPessoa,
  atualizarSenha,
  deletarPessoa,
  buscarCadastro
} from "../controllers/pessoas.controller.js";

import { authMiddleware, requireRole, Roles } from "../middlewares/auth.js";

const router = Router();

// públicas
router.get("/", listarPessoas);
router.get("/:id", buscarPessoa);

router.get("/cadastro", buscarCadastro);

// requer login
router.post("/", authMiddleware, criarPessoa);
router.put("/:id", authMiddleware, atualizarPessoa);
router.patch("/:id/senha", authMiddleware, atualizarSenha);

// apenas admin
router.delete("/:id", authMiddleware, requireRole(Roles.ADMIN), deletarPessoa);

export default router;
