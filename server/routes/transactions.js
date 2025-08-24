import express from "express";
import { getDb } from "../lib/db.js";
import { requireAuth } from "../middleware/auth.js";
import { sendDepositNotification, sendWithdrawalNotification } from "../lib/email.js";

const router = express.Router();

router.post("/deposit", requireAuth, async (req, res) => {
  const { amount, currency } = req.body || {};
  if (!amount || Number(amount) < 50) return res.status(400).json({ error: "Minimum deposit $50" });

  const db = getDb();
  await db.execute({
    sql: "INSERT INTO transactions (userId,type,amount,currency,status) VALUES (?,?,?,?,?)",
    args: [req.userId, "deposit", Number(amount), currency || "USD", "pending"]
  });

  const user = await db.execute({ sql: "SELECT email FROM users WHERE id=?", args: [req.userId] });
  await sendDepositNotification(user.rows[0].email, Number(amount));
  res.json({ ok: true, message: "Deposit recorded as pending. Admin will approve after verification." });
});

router.post("/withdraw", requireAuth, async (req, res) => {
  const { amount, toAddress } = req.body || {};
  if (!amount || Number(amount) < 60) return res.status(400).json({ error: "Minimum withdrawal $60" });

  const db = getDb();
  const u = await db.execute({ sql: "SELECT balance FROM users WHERE id=?", args: [req.userId] });
  const bal = Number(u.rows[0].balance);
  if (bal < Number(amount)) return res.status(400).json({ error: "Insufficient balance" });

  await db.execute({
    sql: "INSERT INTO transactions (userId,type,amount,status,meta) VALUES (?,?,?,?,?)",
    args: [req.userId, "withdrawal", Number(amount), "pending", JSON.stringify({ toAddress })]
  });

  const user = await db.execute({ sql: "SELECT email FROM users WHERE id=?", args: [req.userId] });
  await sendWithdrawalNotification(user.rows[0].email, Number(amount));
  res.json({ ok: true, message: "Withdrawal request submitted (pending admin approval)." });
});

router.get("/history", requireAuth, async (req, res) => {
  const db = getDb();
  const txs = await db.execute({ sql: "SELECT * FROM transactions WHERE userId=? ORDER BY createdAt DESC", args: [req.userId] });
  res.json({ transactions: txs.rows.map(t => ({ ...t, amount: Number(t.amount) })) });
});

export default router;
