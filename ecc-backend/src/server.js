import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import pessoasRoutes from "./routes/pessoas.routes.js";
import eventosRoutes from "./routes/eventos.routes.js";
import equipeRoutes from "./routes/equipe.routes.js";
import inscricoesRoutes from "./routes/inscricoes.routes.js";
import teamroleRoutes from "./routes/teamrole.routes.js";
import momentosRoutes from "./routes/momentos.routes.js";
import equipesEventoRoutes from "./routes/equipesEvento.routes.js";
import coordenadoresRoutes from "./routes/coordenadores.routes.js";
import encontristaInscricaoRoutes from "./routes/encontristaInscricao.routes.js";
import cadastro from "./routes/cadastro.routes.js"; // Nova Rota para Cadastro de Pessoas, Futuros encontreiros e encontristas
import pagamentoRoutes from "./routes/pagamento.routes.js";
import { webhookMercadoPago } from "./controllers/pagamento.controller.js";

import devRoutes from "./routes/dev.routes.js";

import { authMiddleware } from "./middlewares/auth.js";

const app = express();

// ===========================
//  WEBHOOK — PRECISA VIR ANTES DE QUALQUER PARSER
// ===========================
app.post(
  "/webhook/mercadopago",
  bodyParser.raw({ type: "*/*" }), // aceita qualquer tipo enviado pelo MP
  webhookMercadoPago
);

// ===========================

// PARA DEIXAR A ROTA PROTEGIDA COM AUTENTICAÇÃO
// USAER O   authMiddleware,
// ===========================



// ===========================
// PARSERS NORMAIS DO EXPRESS
// (Sempre depois do webhook)
// ===========================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JSON normal para todas as rotas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// ROTAS PÚBLICAS
// ======================================================
app.use("/auth", authRoutes);
app.use("/dev", devRoutes);

// ======================================================
// ROTAS DE CADASTRO (PÚBLICAS)
// ======================================================
app.use("/cadastro", cadastro);  // por enquanto ainda é pública


// Pagamento público (apenas geração do PIX é protegida)
app.use("/pagamento", pagamentoRoutes);
// ======================================================
// ROTAS PROTEGIDAS (LOGIN OBRIGATÓRIO)
// ======================================================
app.use("/pessoas", pessoasRoutes);
app.use("/eventos",  eventosRoutes);
app.use("/equipes",  equipeRoutes);
app.use("/equipes-evento",  equipesEventoRoutes);
app.use("/teamrole",  teamroleRoutes);
app.use("/momentos",  momentosRoutes);

// inscrições comuns são públicas (mantido como você usava)
app.use("/inscricoes", inscricoesRoutes);

app.use("/coordenadores",  coordenadoresRoutes);

// Encontrista-inscrição é protegida por auth
app.use("/encontrista_inscricao",  encontristaInscricaoRoutes);

// Admin
app.use("/admin",  adminRoutes);

// ======================================================
// ROOT ROUTE
// ======================================================
app.get("/", (req, res) => {
  res.send("🚀 Backend ECC funcionando!");
});

// ======================================================
// SERVIDOR
// ======================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// ========================================================
