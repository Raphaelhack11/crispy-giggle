import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

let client;

export function getDb() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) {
      throw new Error("Turso env vars missing (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)");
    }
    client = createClient({ url, authToken });
  }
  return client;
}

export async function initDb() {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      passwordHash TEXT,
      phone TEXT,
      isAdmin INTEGER DEFAULT 0,
      emailVerified INTEGER DEFAULT 0,
      balance REAL DEFAULT 0,
      referral TEXT,
      createdAt DATETIME DEFAULT (datetime('now'))
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      stake REAL,
      dailyRoi REAL,
      durationDays INTEGER
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      planId INTEGER,
      startAt DATETIME DEFAULT (datetime('now')),
      lastCreditedAt DATETIME,
      endAt DATETIME,
      active INTEGER DEFAULT 1
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      type TEXT,
      amount REAL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'pending',
      meta TEXT,
      createdAt DATETIME DEFAULT (datetime('now'))
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      fromAdmin INTEGER DEFAULT 0,
      body TEXT,
      createdAt DATETIME DEFAULT (datetime('now'))
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS verify_tokens (
      token TEXT PRIMARY KEY,
      email TEXT,
      createdAt DATETIME DEFAULT (datetime('now'))
    );
  `);
}

export async function seedInitialData() {
  const db = getDb();

  // Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@profitbliss.com";
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";
  const adminRow = await db.execute({
    sql: "SELECT id FROM users WHERE email = ?",
    args: [adminEmail]
  });
  if (adminRow.rows.length === 0) {
    const hash = await bcrypt.hash(adminPass, 10);
    await db.execute({
      sql: "INSERT INTO users (name,email,passwordHash,isAdmin,emailVerified,balance) VALUES (?,?,?,?,?,?)",
      args: ["Admin", adminEmail, hash, 1, 1, 0]
    });
  }

  // Demo
  const demoEmail = "user@profitbliss.com";
  const demoRow = await db.execute({
    sql: "SELECT id FROM users WHERE email = ?",
    args: [demoEmail]
  });
  if (demoRow.rows.length === 0) {
    const hash = await bcrypt.hash("password123", 10);
    await db.execute({
      sql: "INSERT INTO users (name,email,passwordHash,isAdmin,emailVerified,balance) VALUES (?,?,?,?,?,?)",
      args: ["Demo User", demoEmail, hash, 0, 1, 500]
    });
  }

  // Plans
  const count = await db.execute("SELECT COUNT(*) as c FROM plans");
  const c = Number(count.rows[0].c);
  if (c === 0) {
    const plans = [
      ["Basic", 50, 0.2, 30],
      ["Gold", 100, 0.35, 30],
      ["Premium", 200, 0.5, 30]
    ];
    for (const p of plans) {
      await db.execute({
        sql: "INSERT INTO plans (name, stake, dailyRoi, durationDays) VALUES (?,?,?,?)",
        args: p
      });
    }
  }
                   }
