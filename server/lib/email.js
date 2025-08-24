import nodemailer from "nodemailer";

export function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) throw new Error("EMAIL_USER/EMAIL_PASS not set");
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }
  });
}

export async function sendVerificationEmail(to, token) {
  const FE = process.env.FRONTEND_URL || "";
  const link = `${FE}/verify?token=${encodeURIComponent(token)}`;
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your ProfitBliss account",
    html: `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial;background:#f8fafc;padding:24px">
        <h2 style="color:#0f172a;margin:0 0 8px">Welcome to ProfitBliss</h2>
        <p style="color:#334155;margin:0 0 16px">Click the button below to verify your email address.</p>
        <p>
          <a href="${link}" style="background:#2563eb;color:#fff;padding:12px 16px;border-radius:10px;text-decoration:none;display:inline-block">Verify Email</a>
        </p>
        <p style="color:#64748b;font-size:12px">If the button doesn't work, copy this link:<br/>${link}</p>
      </div>
    `
  });
}

export async function sendDepositNotification(email, amount) {
  const t = getTransporter();
  await t.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Deposit submitted (pending) — ProfitBliss",
    html: `<div style="font-family:system-ui">Your deposit of $${amount} is recorded as <b>pending</b>. Admin will approve it shortly.</div>`
  });
}

export async function sendWithdrawalNotification(email, amount) {
  const t = getTransporter();
  await t.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Withdrawal request received — ProfitBliss",
    html: `<div style="font-family:system-ui">Your withdrawal request of $${amount} has been submitted (<b>pending</b>).</div>`
  });
    }
