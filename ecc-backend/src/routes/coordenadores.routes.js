import { Router } from "express";
import {
  listarCoordenadores,
  promoverCoordenador,
  removerCoordenador,
  listarLideres
} from "../controllers/coordenadores.controller.js";

import { authMiddleware, requireRole, Roles } from "../middlewares/auth.js";

const router = Router();

// listar coordenadores do sistema
router.get("/", authMiddleware, requireRole(Roles.ADMIN), listarCoordenadores);

// promover pessoa
router.post("/promover", authMiddleware, requireRole(Roles.ADMIN), promoverCoordenador);

// remover papel
router.delete("/:pessoaId", authMiddleware, requireRole(Roles.ADMIN), removerCoordenador);

// listar líderes de equipes (por evento)
router.get("/lideres/:eventoId", authMiddleware, listarLideres);

export default router;
