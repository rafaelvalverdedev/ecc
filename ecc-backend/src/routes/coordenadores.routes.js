import { Router } from "express";
import { authRequired, requireRole, Roles } from "../middleware/auth.js";
import { 
  criarCoordenador, 
  listarCoordenadores, 
  deletarCoordenador, 
  atualizarCoordenador, 
  buscarCoordenadorPorId 
} from "../controllers/coordenadores.controller.js";

const router = Router();


router.get("/", listarCoordenadores);
router.get("/:id", buscarCoordenadorPorId);
router.put("/:id", atualizarCoordenador);
router.delete("/:id", deletarCoordenador);


// Somente ADMIN pode criar coordenadores
router.post(
  "/",
  authRequired,
  requireRole(Roles.ADMIN),
  criarCoordenador
);


export default router;