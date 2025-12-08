import { Router } from "express";
import {
  listarEventos,
  buscarEvento,
  criarEvento,
  atualizarEvento,
  deletarEvento
} from "../controllers/eventos.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", listarEventos);
router.get("/:id", buscarEvento);
router.post("/", authMiddleware, criarEvento);
router.put("/:id", authMiddleware, atualizarEvento);
router.delete("/:id", authMiddleware, deletarEvento);

export default router;
