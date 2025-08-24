import { verify } from "../lib/jwt.js";

export function requireAuth(req, res, next) {
  try {
    const hdr = req.headers.authorization;
    if (!hdr) return res.status(401).json({ error: "No token" });
    const token = hdr.split(" ")[1];
    const payload = verify(token);
    req.userId = payload.userId;
    req.isAdmin = !!payload.isAdmin;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
  try {
    const hdr = req.headers.authorization;
    if (!hdr) return res.status(401).json({ error: "No token" });
    const token = hdr.split(" ")[1];
    const payload = verify(token);
    if (!payload.isAdmin) return res.status(403).json({ error: "Admin only" });
    req.userId = payload.userId;
    req.isAdmin = true;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
