import express from "express";

const router = express.Router();

// Example transaction list
router.get("/", (req, res) => {
  res.json([
    { id: 1, type: "deposit", amount: 200 },
    { id: 2, type: "withdrawal", amount: 100 }
  ]);
});

export default router;
