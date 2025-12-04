import { Router } from "express";
import {
  adicionarTeamrole,
  removerTeamrole,
  listarMembrosPorEquipe,
  listarTeamroles
} from "../controllers/teamrole.controller.js";

const router = Router();

router.post("/", adicionarTeamrole);
router.delete("/:id", removerTeamrole);
router.get("/equipe/:equipe_id", listarMembrosPorEquipe);
router.get("/", listarTeamroles);

export default router;
