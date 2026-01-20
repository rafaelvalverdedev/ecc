import { Router } from "express";
import { register, login, atualiza } from "../controllers/auth.controller.js";

const router = Router();

router.put("/register", atualiza);
router.post("/register", register);
router.post("/login", login);

export default router;
