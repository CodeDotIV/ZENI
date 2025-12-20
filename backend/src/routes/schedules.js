import express from 'express';
import pool from '../database/connection.js';
import { generateSchedule } from '../utils/scheduleUtils.js';

const router = express.Router();

// Get schedule for date
router.get('/:date', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { date } = req.params;

    const result = await pool.query(
      'SELECT * FROM schedules WHERE user_id = $1 AND date = $2',
      [userId, date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json({ schedule: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Generate schedule for date
router.post('/generate', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Date required' });
    }

    // Get user preferences
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    // Get pending tasks
    const tasksResult = await pool.query(
      `SELECT * FROM tasks
       WHERE user_id = $1
       AND status IN ('pending', 'in_progress')
       AND (deadline IS NULL OR deadline >= $2::date)
       ORDER BY priority DESC, deadline ASC`,
      [userId, date]
    );

    const tasks = tasksResult.rows;

    // Generate schedule
    const schedule = await generateSchedule(user, tasks, new Date(date));

    // Save schedule
    const scheduleResult = await pool.query(
      `INSERT INTO schedules (user_id, date, time_blocks)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, date)
       DO UPDATE SET time_blocks = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, date, JSON.stringify(schedule.time_blocks)]
    );

    res.json({ schedule: scheduleResult.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;

