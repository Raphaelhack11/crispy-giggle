import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

import { initDb, seedInitialData } from "./lib/db.js";
import authRoutes from "./routes/auth.js";
import plansRoutes from "./routes/plans.js";
import txRoutes from "./routes/transactions.js";
import adminRoutes from "./routes/admin.js";
import messagesRoutes from "./routes/messages.js";
import cronRoutes from "./routes/cron.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// Ensure DB tables exist on boot
await initDb();
await seedInitialData();

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "profitbliss-api" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/transactions", txRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/cron", cronRoutes);

// Serve frontend
const clientDist = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`ProfitBliss server listening on :${PORT}`);
});
