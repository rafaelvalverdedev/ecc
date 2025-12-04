import { Router } from "express";
import {
  criarEquipeEvento,
  listarEquipesEvento,
  buscarEquipeEventoPorId,
  deletarEquipeEvento
} from "../controllers/equipesEvento.controller.js";

const router = Router();

router.post("/", criarEquipeEvento);
router.get("/", listarEquipesEvento);
router.get("/:id", buscarEquipeEventoPorId);
router.delete("/:id", deletarEquipeEvento);

export default router;
