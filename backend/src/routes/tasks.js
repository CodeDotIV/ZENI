import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../database/connection.js';
import { calculatePriority } from '../utils/taskUtils.js';

const router = express.Router();

// Get all tasks for user
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { status, course_id } = req.query;

    let query = `
      SELECT t.*, c.name as course_name
      FROM tasks t
      LEFT JOIN courses c ON t.course_id = c.id
      WHERE t.user_id = $1
    `;
    const params = [userId];

    if (status) {
      query += ` AND t.status = $${params.length + 1}`;
      params.push(status);
    }

    if (course_id) {
      query += ` AND t.course_id = $${params.length + 1}`;
      params.push(course_id);
    }

    query += ' ORDER BY t.deadline ASC, t.priority DESC';

    const result = await pool.query(query, params);
    res.json({ tasks: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get single task
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;

    const result = await pool.query(
      `SELECT t.*, c.name as course_name
       FROM tasks t
       LEFT JOIN courses c ON t.course_id = c.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Create task
router.post('/', [
  body('title').notEmpty().trim(),
  body('deadline').optional().isISO8601(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const {
      title,
      description,
      deadline,
      priority,
      course_id,
      estimated_time,
      ai_generated
    } = req.body;

    // Calculate priority if not provided
    const taskPriority = priority || (deadline ? calculatePriority(new Date(deadline)) : 5);

    const result = await pool.query(
      `INSERT INTO tasks (
        user_id, course_id, title, description, deadline, priority,
        estimated_time, ai_generated
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [userId, course_id || null, title, description || null, deadline || null, taskPriority, estimated_time || null, ai_generated || false]
    );

    res.status(201).json({ task: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Update task
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;
    const updates = req.body;

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'user_id' && key !== 'created_at') {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(taskId, userId);

    const query = `
      UPDATE tasks
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Bulk create tasks (for syllabus parsing)
router.post('/bulk', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { tasks } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Tasks array required' });
    }

    const createdTasks = [];

    for (const taskData of tasks) {
      const {
        title,
        description,
        deadline,
        course_id,
        estimated_time,
        priority
      } = taskData;

      const taskPriority = priority || (deadline ? calculatePriority(new Date(deadline)) : 5);

      const result = await pool.query(
        `INSERT INTO tasks (
          user_id, course_id, title, description, deadline, priority,
          estimated_time, ai_generated
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, true)
        RETURNING *`,
        [userId, course_id || null, title, description || null, deadline || null, taskPriority, estimated_time || null]
      );

      createdTasks.push(result.rows[0]);
    }

    res.status(201).json({ tasks: createdTasks, count: createdTasks.length });
  } catch (error) {
    next(error);
  }
});

export default router;

