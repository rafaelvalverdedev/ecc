import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";

import eventosRoutes from "./routes/eventos.routes.js";
import equipeRoutes from "./routes/equipe.routes.js";
import inscricoesRoutes from "./routes/inscricoes.routes.js";
import pessoasRoutes from "./routes/pessoas.routes.js";
import teamroleRoutes from "./routes/teamrole.routes.js";
import momentosRoutes from "./routes/momentos.routes.js";
import devRoutes from "./routes/dev.routes.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import coordenadoresRoutes from "./routes/coordenadores.routes.js";

import pagamentoRoutes from "./routes/pagamento.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

import equipesEventoRoutes from "./routes/equipesEvento.routes.js";

import { authMiddleware } from "./middlewares/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);

app.use("/coordenadores", coordenadoresRoutes);

app.use("/auth", authRoutes);

app.use("/dev", devRoutes);

app.use("/eventos", authMiddleware, eventosRoutes);
app.use("/equipes", equipeRoutes);
app.use("/inscricoes", inscricoesRoutes);
app.use("/pessoas", pessoasRoutes);
app.use("/teamrole", teamroleRoutes);
app.use("/momentos", momentosRoutes);

app.use("/equipe_evento", equipesEventoRoutes);

app.use("/inscricoes", inscricoesRoutes);

app.use("/api", pagamentoRoutes);
app.use("/webhook", webhookRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend ECC funcionando!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
});
