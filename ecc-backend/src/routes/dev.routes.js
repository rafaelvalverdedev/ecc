import { Router } from "express";
import { resetDatabase } from "../controllers/dev.controller.js";

const router = Router();

router.delete("/reset", resetDatabase);

export default router;
