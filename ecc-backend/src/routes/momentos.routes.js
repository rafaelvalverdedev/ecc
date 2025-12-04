import { Router } from "express";
import {
  criarMomento,
  listarMomentosPorEvento,
  buscarMomentoPorId,
  deletarMomento
} from "../controllers/momentos.controller.js";

const router = Router();

router.post("/", criarMomento);
router.get("/evento/:evento_id", listarMomentosPorEvento);
router.get("/:id", buscarMomentoPorId);
router.delete("/:id", deletarMomento);

export default router;
