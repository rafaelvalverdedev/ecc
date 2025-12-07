import { Router } from "express";
import { authMiddleware, requireRole, Roles } from "../middlewares/auth.js";

import {
  criarCoordenador,
  listarCoordenadores,
  deletarCoordenador,
  atualizarCoordenador,
  buscarCoordenadorPorId
} from "../controllers/coordenadores.controller.js";

const router = Router();

router.get("/", listarCoordenadores);
router.get("/:id", buscarCoordenadorPorId);

router.post("/", authMiddleware, requireRole(Roles.ADMIN), criarCoordenador);
router.put("/:id", authMiddleware, requireRole(Roles.ADMIN), atualizarCoordenador);
router.delete("/:id", authMiddleware, requireRole(Roles.ADMIN), deletarCoordenador);

export default router;
