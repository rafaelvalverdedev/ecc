import { Router } from "express";
import {
    criarCadastro,
    carregarCadastro,
    buscar
} from "../controllers/cadastro.controller.js";

import { upload } from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireRole, Roles } from "../middlewares/auth.js";

const router = Router();

router.get("/", carregarCadastro);
router.get("/:id", buscar);

router.post("/", upload.single("foto_casal"), criarCadastro);

export default router;
