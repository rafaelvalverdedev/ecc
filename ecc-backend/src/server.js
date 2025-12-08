import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

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

import webhookRoutes from "./routes/webhook.routes.js";
import devRoutes from "./routes/dev.routes.js";

import { authMiddleware } from "./middlewares/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// ==============================
// ROTAS PÚBLICAS
// ==============================
app.use("/auth", authRoutes);
app.use("/webhook", webhookRoutes); // sempre público (Mercado Pago)
app.use("/dev", devRoutes); // deixar somente em ambiente DEV
app.use("/pagamento", pagamentoRoutes);

// ==============================
// ROTAS PROTEGIDAS (LOGIN NECESSÁRIO)
// ==============================
app.use("/pessoas", authMiddleware, pessoasRoutes);
app.use("/eventos", authMiddleware, eventosRoutes);
app.use("/equipes", authMiddleware, equipeRoutes);
app.use("/equipes-evento", authMiddleware, equipesEventoRoutes);
app.use("/teamrole", authMiddleware, teamroleRoutes);
app.use("/momentos", authMiddleware, momentosRoutes);
app.use("/inscricoes", authMiddleware, inscricoesRoutes);
app.use("/coordenadores", authMiddleware, coordenadoresRoutes);
app.use("/encontrista-inscricao", authMiddleware, encontristaInscricaoRoutes);
app.use("/pagamento", authMiddleware, pagamentoRoutes);

// ==============================
// ADMIN
// ==============================
app.use("/admin", authMiddleware, adminRoutes);

// ==============================
// ROOT ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 Backend ECC funcionando!");
});

// ==============================
// SERVIDOR
// ==============================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
