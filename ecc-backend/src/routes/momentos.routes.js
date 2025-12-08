import { Router } from "express";
import {
  listarMomentos,
  listarPorEvento,
  buscarMomento,
  criarMomento,
  atualizarMomento,
  deletarMomento
} from "../controllers/momentos.controller.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", listarMomentos);
router.get("/evento/:eventoId", listarPorEvento);
router.get("/:id", buscarMomento);

router.post("/", authMiddleware, criarMomento);
router.put("/:id", authMiddleware, atualizarMomento);
router.delete("/:id", authMiddleware, deletarMomento);

export default router;
