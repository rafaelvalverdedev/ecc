import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.get("/", (req, res) => { res.send("Backend ECC funcionando!"); });

router.post("/register", register);
router.post("/login", login);

export default router;
