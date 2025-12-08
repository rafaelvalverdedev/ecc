import { Router } from "express";
import {
  listar,
  buscar,
  criar,
  atualizar,
  deletar
} from "../controllers/encontristaInscricao.controller.js";

import { authMiddleware, requireRole, Roles } from "../middlewares/auth.js";

const router = Router();

router.get("/", listar);
router.get("/:id", buscar);

router.post("/", authMiddleware, criar);
router.put("/:id", authMiddleware, atualizar);

router.delete("/:id", authMiddleware, requireRole(Roles.ADMIN), deletar);

export default router;
