import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET ACTIVITY LOGS
router.get("/", authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const [rows] = await pool.query(
      "SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
      [req.user.id, limit]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    res.status(500).json({ error: "Error fetching activity logs" });
  }
});

// ADD ACTIVITY LOG
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { action, description } = req.body;

    if (!action) {
      return res.status(400).json({ error: "Action is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)",
      [req.user.id, action, description || ""]
    );

    res.json({ 
      id: result.insertId, 
      user_id: req.user.id,
      action, 
      description,
      created_at: new Date()
    });
  } catch (err) {
    console.error("Error adding activity log:", err);
    res.status(500).json({ error: "Error adding activity log" });
  }
});

export default router;
