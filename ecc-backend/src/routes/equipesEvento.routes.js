import { Router } from "express";
import {
  listarVinculos,
  listarPorEvento,
  listarPorEquipe,
  criarVinculo,
  deletarVinculo
} from "../controllers/equipesEvento.controller.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", listarVinculos);
router.get("/evento/:eventoId", listarPorEvento);
router.get("/equipe/:equipeId", listarPorEquipe);

router.post("/", authMiddleware, criarVinculo);
router.delete("/:id", authMiddleware, deletarVinculo);

export default router;
