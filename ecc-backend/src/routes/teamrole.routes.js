import { Router } from "express";
import {
  listarTeamRoles,
  listarPorPessoa,
  listarPorEquipe,
  listarPorEvento,
  criarTeamRole,
  atualizarTeamRole,
  deletarTeamRole,
} from "../controllers/teamrole.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", listarTeamRoles);
router.get("/pessoa/:pessoaId", listarPorPessoa);
router.get("/equipe/:equipeId", listarPorEquipe);
router.get("/evento/:eventoId", listarPorEvento);

router.post("/", authMiddleware, criarTeamRole);
router.put("/:id", authMiddleware, atualizarTeamRole);
router.delete("/:id", authMiddleware, deletarTeamRole);

export default router;
