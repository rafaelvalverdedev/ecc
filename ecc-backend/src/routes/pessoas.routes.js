import { Router } from "express";
import {
  criarPessoa,
  listarPessoas,
  buscarPessoaPorId,
  atualizarPessoa,
  deletarPessoa
} from "../controllers/pessoas.controller.js";

const router = Router();

router.post("/", criarPessoa);
router.get("/", listarPessoas);
router.get("/:id", buscarPessoaPorId);
router.put("/:id", atualizarPessoa);
router.delete("/:id", deletarPessoa);

export default router;
