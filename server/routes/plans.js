import express from "express";
import { getDb } from "../lib/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const db = getDb();
  const r = await db.execute("SELECT * FROM plans");
  res.json({ plans: r.rows.map(x => ({ ...x, stake: Number(x.stake), dailyRoi: Number(x.dailyRoi), durationDays: Number(x.durationDays) })) });
});

router.post("/subscribe", requireAuth, async (req, res) => {
  const { planId } = req.body || {};
  const db = getDb();

  const pr = await db.execute({ sql: "SELECT * FROM plans WHERE id=?", args: [planId] });
  if (pr.rows.length === 0) return res.status(404).json({ error: "Plan not found" });
  const plan = pr.rows[0];

  const ur = await db.execute({ sql: "SELECT * FROM users WHERE id=?", args: [req.userId] });
  const user = ur.rows[0];
  if (Number(user.balance) < Number(plan.stake)) {
    return res.status(402).json({ error: "Insufficient balance" });
  }

  const now = new Date();
  const startAt = now.toISOString();
  const endAt = new Date(now.getTime() + Number(plan.durationDays) * 86400000).toISOString();

  await db.execute({ sql: "UPDATE users SET balance = balance - ? WHERE id=?", args: [plan.stake, req.userId] });
  await db.execute({
    sql: "INSERT INTO user_plans (userId, planId, startAt, lastCreditedAt, endAt, active) VALUES (?,?,?,?,?,1)",
    args: [req.userId, planId, startAt, startAt, endAt]
  });
  await db.execute({ sql: "INSERT INTO transactions (userId,type,amount,status) VALUES (?,?,?,?)", args: [req.userId, "subscribe", plan.stake, "completed"] });

  res.json({ ok: true });
});

router.get("/active", requireAuth, async (req, res) => {
  const db = getDb();
  const rows = await db.execute({
    sql: `
      SELECT up.*, p.name, p.dailyRoi, p.stake
      FROM user_plans up
      JOIN plans p ON p.id = up.planId
      WHERE up.userId=? AND up.active=1
      ORDER BY up.startAt DESC
    `,
    args: [req.userId]
  });
  res.json({ active: rows.rows.map(r => ({ ...r, dailyRoi: Number(r.dailyRoi), stake: Number(r.stake) })) });
});

export default router;
