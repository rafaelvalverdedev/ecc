import { Router } from "express";
import { createUserByAdmin } from "../controllers/admin.controller.js";
import { authMiddleware, requireRole, Roles } from "../middlewares/auth.js";

const router = Router();

router.post(
  "/create-user",
  authMiddleware,
  requireRole(Roles.ADMIN),
  createUserByAdmin
);

export default router;
