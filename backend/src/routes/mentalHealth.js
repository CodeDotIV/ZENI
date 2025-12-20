import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../database/connection.js';

const router = express.Router();

// Create mental health check-in
router.post('/checkin', [
  body('stress_level').optional().isInt({ min: 1, max: 10 }),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { stress_level, mood, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO mental_health_checkins (user_id, stress_level, mood, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, stress_level || null, mood || null, notes || null]
    );

    res.status(201).json({ checkin: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Get mental health insights
router.get('/insights', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT 
        AVG(stress_level) as avg_stress,
        COUNT(*) as checkin_count,
        MIN(created_at) as first_checkin,
        MAX(created_at) as last_checkin
       FROM mental_health_checkins
       WHERE user_id = $1
       AND created_at >= NOW() - INTERVAL '${days} days'`,
      [userId]
    );

    // Get recent check-ins
    const recentResult = await pool.query(
      `SELECT * FROM mental_health_checkins
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    res.json({
      insights: result.rows[0],
      recent_checkins: recentResult.rows
    });
  } catch (error) {
    next(error);
  }
});

export default router;

