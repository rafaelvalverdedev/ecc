import express from "express";
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
import cadastro from "./routes/cadastro.routes.js";
import pagamentoRoutes from "./routes/pagamento.routes.js";
import rotateste from "./routes/rotateste.routes.js";
import devRoutes from "./routes/dev.routes.js";

import { webhookMercadoPago } from "./controllers/pagamento.controller.js";
import { authMiddleware } from "./middlewares/auth.js";

const app = express();

// WEBHOOK — antes de qualquer parser
app.post(
  "/webhook/mercadopago",
  express.raw({ type: "*/*" }),
  webhookMercadoPago
);

// Parsers globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas públicas
app.use("/auth", authRoutes);
app.use("/dev", devRoutes);
app.use("/cadastro", cadastro);
app.use("/pagamento", pagamentoRoutes);

// Rotas protegidas
app.use("/pessoas", authMiddleware, pessoasRoutes);
app.use("/eventos", authMiddleware, eventosRoutes);
app.use("/equipes", authMiddleware, equipeRoutes);
app.use("/equipes-evento", authMiddleware, equipesEventoRoutes);
app.use("/teamrole", authMiddleware, teamroleRoutes);
app.use("/momentos", authMiddleware, momentosRoutes);
app.use("/inscricoes", authMiddleware, inscricoesRoutes);
app.use("/coordenadores", authMiddleware, coordenadoresRoutes);
app.use("/encontrista_inscricao", authMiddleware, encontristaInscricaoRoutes);
app.use("/admin", authMiddleware, adminRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Backend ECC funcionando");
});

// 404 (rota não encontrada)
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Middleware global de erro
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
