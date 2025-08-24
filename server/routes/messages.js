import express from "express";
import { getDb } from "../lib/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const { body } = req.body || {};
  if (!body) return res.status(400).json({ error: "Message empty" });
  const db = getDb();
  await db.execute({ sql: "INSERT INTO messages (userId, body, fromAdmin) VALUES (?,?,0)", args: [req.userId, body] });
  res.json({ ok: true });
});

router.get("/mine", requireAuth, async (req, res) => {
  const db = getDb();
  const rows = await db.execute({ sql: "SELECT * FROM messages WHERE userId=? ORDER BY createdAt DESC", args: [req.userId] });
  res.json({ messages: rows.rows });
});

export default router;
