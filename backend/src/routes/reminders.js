import express from 'express';
import pool from '../database/connection.js';

const router = express.Router();

// Reminder queue initialization (disabled for now - requires Redis)
// TODO: Enable when Redis is set up
let reminderQueue = null;

// Helper function to initialize queue (can be called later when Redis is available)
async function initReminderQueue() {
  if (reminderQueue) return reminderQueue;
  
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const bull = require('bull');
    
    // Bull v4 exports Queue as default or named export
    const Queue = bull.default || bull.Queue || bull;
    
    if (Queue) {
      reminderQueue = new Queue('reminders', {
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379
        }
      });
      console.log('✅ Reminder queue initialized');
    }
  } catch (error) {
    console.warn('⚠️  Reminder queue not available (Redis required):', error.message);
  }
  
  return reminderQueue;
}

// Schedule reminder
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { task_id, reminder_time, tone } = req.body;

    // Verify task belongs to user
    const taskResult = await pool.query(
      'SELECT id, title, deadline FROM tasks WHERE id = $1 AND user_id = $2',
      [task_id, userId]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = taskResult.rows[0];

    // Create reminder in database
    const reminderResult = await pool.query(
      `INSERT INTO reminders (user_id, task_id, reminder_time, tone)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, task_id, reminder_time, tone || 'friendly']
    );

    const reminder = reminderResult.rows[0];

    // Schedule reminder job (if queue is available)
    // Note: Reminders are saved to database regardless
    // Queue is optional and requires Redis
    const queue = await initReminderQueue();
    if (queue) {
      try {
        const delay = new Date(reminder_time).getTime() - Date.now();
        if (delay > 0) {
          await queue.add('send-reminder', {
            reminder_id: reminder.id,
            user_id: userId,
            task_id: task_id,
            task_title: task.title,
            tone: reminder.tone
          }, {
            delay
          });
        }
      } catch (queueError) {
        console.warn('Could not queue reminder (saved to DB):', queueError.message);
      }
    }

    res.status(201).json({ reminder });
  } catch (error) {
    next(error);
  }
});

// Get reminders
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { upcoming = true } = req.query;

    let query = `
      SELECT r.*, t.title as task_title, t.deadline
      FROM reminders r
      JOIN tasks t ON r.task_id = t.id
      WHERE r.user_id = $1
    `;

    if (upcoming === 'true') {
      query += ' AND r.reminder_time > NOW() AND r.sent = false';
    }

    query += ' ORDER BY r.reminder_time ASC';

    const result = await pool.query(query, [userId]);
    res.json({ reminders: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;

