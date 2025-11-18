import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all todos for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [todos] = await pool.execute(
      'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Server error fetching todos' });
  }
});

// Create todo
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      reminderEnabled = false,
      reminderDateTime = null
    } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Title and due date are required' });
    }

    if (reminderEnabled && !reminderDateTime) {
      return res.status(400).json({ error: 'Reminder date/time is required when reminders are enabled' });
    }

    const reminderValue =
      reminderEnabled && reminderDateTime ? new Date(reminderDateTime) : null;

    const [result] = await pool.execute(
      `INSERT INTO todos (user_id, title, description, due_date, reminder_enabled, reminder_at, completed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, description || '', dueDate, reminderEnabled ? 1 : 0, reminderValue, 0]
    );

    const [newTodo] = await pool.execute('SELECT * FROM todos WHERE id = ?', [result.insertId]);

    res.status(201).json(newTodo[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Server error creating todo' });
  }
});

// Update todo
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      dueDate,
      completed,
      reminderEnabled = false,
      reminderDateTime = null
    } = req.body;

    const [todos] = await pool.execute(
      'SELECT id FROM todos WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (todos.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (reminderEnabled && !reminderDateTime) {
      return res.status(400).json({ error: 'Reminder date/time is required when reminders are enabled' });
    }

    const reminderValue =
      reminderEnabled && reminderDateTime ? new Date(reminderDateTime) : null;

    await pool.execute(
      `UPDATE todos 
       SET title = ?, description = ?, due_date = ?, reminder_enabled = ?, reminder_at = ?, completed = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ? AND user_id = ?`,
      [
        title,
        description || '',
        dueDate,
        reminderEnabled ? 1 : 0,
        reminderValue,
        completed ? 1 : 0,
        id,
        req.user.id
      ]
    );

    const [updatedTodo] = await pool.execute('SELECT * FROM todos WHERE id = ?', [id]);

    res.json(updatedTodo[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Server error updating todo' });
  }
});

// Delete todo
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [todos] = await pool.execute(
      'SELECT id FROM todos WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (todos.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await pool.execute('DELETE FROM todos WHERE id = ? AND user_id = ?', [id, req.user.id]);

    res.json({ message: 'Todo removed!' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Server error deleting todo' });
  }
});

// Delete all todos for user
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await pool.execute('DELETE FROM todos WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'All todos deleted successfully' });
  } catch (error) {
    console.error('Error deleting all todos:', error);
    res.status(500).json({ error: 'Server error deleting todos' });
  }
});

export default router;
