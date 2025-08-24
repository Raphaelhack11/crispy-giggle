import express from "express";
import { getDb } from "../lib/db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/pending/deposits", requireAdmin, async (_req, res) => {
  const db = getDb();
  const rows = await db.execute(`
    SELECT t.*, u.email
    FROM transactions t
    JOIN users u ON u.id = t.userId
    WHERE t.type='deposit' AND t.status='pending'
    ORDER BY t.createdAt DESC
  `);
  res.json({ pending: rows.rows.map(r => ({ ...r, amount: Number(r.amount) })) });
});

router.post("/deposits/:id/approve", requireAdmin, async (req, res) => {
  const id = req.params.id;
  const db = getDb();
  const tx = await db.execute({ sql: "SELECT * FROM transactions WHERE id=?", args: [id] });
  if (tx.rows.length === 0) return res.status(404).json({ error: "Not found" });
  const t = tx.rows[0];
  if (t.status !== "pending") return res.status(400).json({ error: "Not pending" });
  await db.execute({ sql: "UPDATE transactions SET status='completed' WHERE id=?", args: [id] });
  await db.execute({ sql: "UPDATE users SET balance = balance + ? WHERE id=?", args: [Number(t.amount), t.userId] });
  res.json({ ok: true });
});

router.get("/pending/withdrawals", requireAdmin, async (_req, res) => {
  const db = getDb();
  const rows = await db.execute(`
    SELECT t.*, u.email
    FROM transactions t
    JOIN users u ON u.id = t.userId
    WHERE t.type='withdrawal' AND t.status='pending'
    ORDER BY t.createdAt DESC
  `);
  res.json({ pending: rows.rows.map(r => ({ ...r, amount: Number(r.amount) })) });
});

router.post("/withdrawals/:id/approve", requireAdmin, async (req, res) => {
  const id = req.params.id;
  const db = getDb();
  const tx = await db.execute({ sql: "SELECT * FROM transactions WHERE id=?", args: [id] });
  if (tx.rows.length === 0) return res.status(404).json({ error: "Not found" });
  const t = tx.rows[0];
  if (t.status !== "pending") return res.status(400).json({ error: "Not pending" });
  // deduct balance
  await db.execute({ sql: "UPDATE users SET balance = balance - ? WHERE id=?", args: [Number(t.amount), t.userId] });
  await db.execute({ sql: "UPDATE transactions SET status='completed' WHERE id=?", args: [id] });
  res.json({ ok: true });
});

router.get("/messages", requireAdmin, async (_req, res) => {
  const db = getDb();
  const rows = await db.execute(`
    SELECT m.*, u.email
    FROM messages m
    JOIN users u ON u.id = m.userId
    ORDER BY m.createdAt DESC
  `);
  res.json({ messages: rows.rows });
});

export default router;
