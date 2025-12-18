import { Router } from "express";
import {
    criarCadastro
} from "../controllers/cadastro.controller.js";

import { authMiddleware } from "../middlewares/auth.js";
import { requireRole, Roles } from "../middlewares/auth.js";

const router = Router();

// router.get("/", criarCadastro);

router.post("/", criarCadastro);

export default router;
