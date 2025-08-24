import express from "express";

const router = express.Router();

// Example login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Dummy login for testing
  if (email === "admin@test.com" && password === "123456") {
    return res.json({ message: "Login successful", token: "fake-jwt-token" });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

export default router;
