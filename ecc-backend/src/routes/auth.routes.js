import { Router } from "express";
import { register, login, atualiza, teamroleCadastro } from "../controllers/auth.controller.js";

const router = Router();

router.put("/register", atualiza);
router.post("/register", register);
router.post("/login", login);

router.get("/teamroleCadastro/:email", teamroleCadastro);

export default router;
