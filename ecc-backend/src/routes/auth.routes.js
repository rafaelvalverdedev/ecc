// src/routes/auth.routes.js
import { Router } from "express";
import { linkAuthToPessoa, me } from "../controllers/auth.controller.js";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/link", ensureAuthenticated, linkAuthToPessoa);
router.get("/me", ensureAuthenticated, me);

export default router;
