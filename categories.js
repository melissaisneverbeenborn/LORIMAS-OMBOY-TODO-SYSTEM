import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).send("Error fetching categories");
  }
});

// CREATE CATEGORY
router.post("/", async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).send("Name and color are required");
    }

    const [result] = await pool.query(
      "INSERT INTO categories (name, color) VALUES (?, ?)",
      [name, color]
    );

    res.json({ id: result.insertId, name, color });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding category");
  }
});

// DELETE CATEGORY
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM categories WHERE id = ?", [id]);

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).send("Error deleting category");
  }
});

export default router;
