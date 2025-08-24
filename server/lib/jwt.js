import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verify(token) {
  return jwt.verify(token, SECRET);
}
