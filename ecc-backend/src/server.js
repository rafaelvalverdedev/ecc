import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

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

import pagamentoRoutes from "./routes/pagamento.routes.js";
import { webhookMercadoPago } from "./controllers/pagamento.controller.js";

import devRoutes from "./routes/dev.routes.js";

import { authMiddleware } from "./middlewares/auth.js";

const app = express();
app.use(cors());

// JSON normal para todas as rotas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// ROTAS PÚBLICAS
// ======================================================
app.use("/auth", authRoutes);
app.use("/dev", devRoutes);

// Webhook precisa do body cru
app.post(
  "/webhook/mercadopago",
  bodyParser.raw({ type: "application/json" }),
  webhookMercadoPago
);

// Pagamento público (apenas geração do PIX é protegida)
app.use("/pagamento", pagamentoRoutes);

// ======================================================
// ROTAS PROTEGIDAS (LOGIN OBRIGATÓRIO)
// ======================================================
app.use("/pessoas", authMiddleware, pessoasRoutes);
app.use("/eventos", authMiddleware, eventosRoutes);
app.use("/equipes", authMiddleware, equipeRoutes);
app.use("/equipes-evento", authMiddleware, equipesEventoRoutes);
app.use("/teamrole", authMiddleware, teamroleRoutes);
app.use("/momentos", authMiddleware, momentosRoutes);

// inscrições comuns são públicas (mantido como você usava)
app.use("/inscricoes", inscricoesRoutes);

app.use("/coordenadores", authMiddleware, coordenadoresRoutes);

// Encontrista-inscrição é protegida por auth
app.use("/encontrista-inscricao", authMiddleware, encontristaInscricaoRoutes);

// Admin
app.use("/admin", authMiddleware, adminRoutes);

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
