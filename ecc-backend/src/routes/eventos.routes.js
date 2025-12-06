import { Router } from "express";
import {
  criarEvento,
  listarEventos,
  buscarEventoPorId,
  atualizarEvento,
  deletarEvento,
  listarEquipesDoEvento
} from "../controllers/eventos.controller.js";


const router = Router();

router.post("/", criarEvento);

router.get("/", listarEventos);
router.get("/:id", buscarEventoPorId);
router.get("/:id/equipes", listarEquipesDoEvento);

router.put("/:id", atualizarEvento);

router.delete("/:id", deletarEvento);

export default router;
