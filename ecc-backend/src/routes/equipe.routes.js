import { Router } from "express";
import {
  criarEquipe,
  listarEquipes,
  buscarEquipePorId,
  atualizarEquipe,
  deletarEquipe
} from "../controllers/equipe.controller.js";

const router = Router();

router.post("/", criarEquipe);
router.get("/", listarEquipes);
router.get("/:id", buscarEquipePorId);
router.put("/:id", atualizarEquipe);
router.delete("/:id", deletarEquipe);

export default router;
