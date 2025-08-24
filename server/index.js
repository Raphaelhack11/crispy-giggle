// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.js";
import investmentRoutes from "./routes/investments.js";
import transactionRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/transactions", transactionRoutes);

// Serve React frontend (after build)
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
