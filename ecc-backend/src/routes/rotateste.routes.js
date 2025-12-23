import { Router } from "express";
import {
    rotaA
} from "../controllers/rotateste.controller.js";

const router = Router();

router.get("/", rotaA);

export default router;
