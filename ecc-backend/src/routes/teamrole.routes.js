import { Router } from "express";
import {
  adicionarTeamrole,
  removerTeamrole,
  listarMembrosPorEquipe,
  listarTeamroles,
  buscarTeamrolePorId,
  atualizarTeamrole 
} from "../controllers/teamrole.controller.js";

const router = Router();

router.post("/", adicionarTeamrole);
router.delete("/:id", removerTeamrole);
router.get("/equipe/:equipe_id", listarMembrosPorEquipe);
router.get("/", listarTeamroles);
router.get("/:id", buscarTeamrolePorId);
router.put("/:id", atualizarTeamrole);
export default router;
