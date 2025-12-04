import { Router } from "express";
import { createUserByAdmin } from "../controllers/admin.controller.js";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/roles.middleware.js";

const router = Router();
router.post("/create-user", ensureAuthenticated, requireAdmin, createUserByAdmin);
export default router;
