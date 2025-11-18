import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET REPORT SUMMARY
router.get("/", async (req, res) => {
  try {
    const [[todos]] = await pool.query("SELECT COUNT(*) AS totalTodos FROM todos");
    const [[completed]] = await pool.query(
      "SELECT COUNT(*) AS completed FROM todos WHERE completed = 1"
    );
    const [[pending]] = await pool.query(
      "SELECT COUNT(*) AS pending FROM todos WHERE completed = 0"
    );
    const [[categories]] = await pool.query(
      "SELECT COUNT(*) AS totalCategories FROM categories"
    );

    res.json({
      todos: todos.totalTodos,
      completed: completed.completed,
      pending: pending.pending,
      categories: categories.totalCategories,
    });
  } catch (err) {
    res.status(500).send("Error generating report");
  }
});

export default router;
