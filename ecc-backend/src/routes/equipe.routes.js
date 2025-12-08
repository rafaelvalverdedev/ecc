import { Router } from "express";
import {
  listarEquipes,
  buscarEquipe,
  criarEquipe,
  atualizarEquipe,
  deletarEquipe,
} from "../controllers/equipe.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", listarEquipes);
router.get("/:id", buscarEquipe);

// protegidas (criar/editar/excluir)
router.post("/", authMiddleware, criarEquipe);
router.put("/:id", authMiddleware, atualizarEquipe);
router.delete("/:id", authMiddleware, deletarEquipe);

export default router;
