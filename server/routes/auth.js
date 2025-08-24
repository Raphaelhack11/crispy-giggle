import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDb } from "../lib/db.js";
import { sign } from "../lib/jwt.js";
import { sendVerificationEmail } from "../lib/email.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, phone, referral } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing fields" });

  // OPTIONAL referral check
  if (referral && referral !== "tmdf28dns") {
    return res.status(400).json({ error: "Invalid referral code" });
  }

  const db = getDb();
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.execute({
      sql: "INSERT INTO users (name,email,passwordHash,phone,referral) VALUES (?,?,?,?,?)",
      args: [name, email, hash, phone || "", referral || null]
    });
  } catch (e) {
    return res.status(400).json({ error: "Email already used" });
  }

  const token = crypto.randomBytes(16).toString("hex");
  await db.execute({ sql: "INSERT INTO verify_tokens (token,email) VALUES (?,?)", args: [token, email] });
  await sendVerificationEmail(email, token);
  res.json({ ok: true, message: "Registered — check your email to verify." });
});

router.get("/verify/:token", async (req, res) => {
  const token = req.params.token;
  const db = getDb();
  const q = await db.execute({ sql: "SELECT email FROM verify_tokens WHERE token = ?", args: [token] });
  if (q.rows.length === 0) return res.status(400).send("Invalid token");
  const email = q.rows[0].email;
  await db.execute({ sql: "UPDATE users SET emailVerified=1 WHERE email=?", args: [email] });
  await db.execute({ sql: "DELETE FROM verify_tokens WHERE token=?", args: [token] });
  const FE = process.env.FRONTEND_URL || "/";
  return res.redirect(`${FE}/verified`);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const db = getDb();
  const rows = await db.execute({ sql: "SELECT * FROM users WHERE email=?", args: [email] });
  if (rows.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });
  const user = rows.rows[0];
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  if (!Number(user.emailVerified)) return res.status(403).json({ error: "Email not verified" });
  const token = sign({ userId: user.id, isAdmin: !!Number(user.isAdmin) });
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, balance: Number(user.balance), isAdmin: !!Number(user.isAdmin) }
  });
});

export default router;
