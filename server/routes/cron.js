import express from "express";
import { getDb } from "../lib/db.js";

const router = express.Router();

// GET /api/cron/roi — call from a Render Scheduled Job daily
router.get("/roi", async (_req, res) => {
  const db = getDb();

  const ups = await db.execute(`
    SELECT up.*, p.dailyRoi, p.durationDays, p.stake
    FROM user_plans up
    JOIN plans p ON p.id = up.planId
    WHERE up.active = 1
  `);

  const now = new Date();
  let creditedUsers = 0;

  for (const up of ups.rows) {
    try {
      const last = up.lastCreditedAt ? new Date(up.lastCreditedAt) : new Date(up.startAt);
      const days = Math.floor((now.getTime() - last.getTime()) / 86400000);
      if (days >= 1) {
        const credit = Number(up.dailyRoi) * Number(up.stake) * days;
        if (credit > 0) {
          await db.execute({ sql: "UPDATE users SET balance = balance + ? WHERE id=?", args: [credit, up.userId] });
          await db.execute({
            sql: "INSERT INTO transactions (userId,type,amount,status) VALUES (?,?,?,?)",
            args: [up.userId, "roi", credit, "completed"]
          });
        }
        const newLast = new Date(last.getTime() + days * 86400000).toISOString();
        await db.execute({ sql: "UPDATE user_plans SET lastCreditedAt=? WHERE id=?", args: [newLast, up.id] });
        // expire
        if (new Date(up.endAt) <= now) {
          await db.execute({ sql: "UPDATE user_plans SET active=0 WHERE id=?", args: [up.id] });
        }
        creditedUsers++;
      }
    } catch (e) {
      console.error("ROI error:", e);
    }
  }

  res.json({ ok: true, processed: ups.rows.length, creditedUsers });
});

export default router;
