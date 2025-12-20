import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../database/connection.js';

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').optional().trim(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, first_name } = req.body;

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, first_name, onboarding_complete`,
      [email, passwordHash, first_name]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        onboarding_complete: user.onboarding_complete
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, onboarding_complete FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        onboarding_complete: user.onboarding_complete
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// Update onboarding
router.post('/onboarding', [
  body('user_id').isUUID(),
], async (req, res, next) => {
  try {
    const { user_id, ...onboardingData } = req.body;

    // Update user with onboarding data
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(onboardingData).forEach(key => {
      updateFields.push(`${key} = $${paramCount}`);
      values.push(onboardingData[key]);
      paramCount++;
    });

    updateFields.push(`onboarding_complete = $${paramCount}`);
    values.push(true);
    paramCount++;

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(user_id);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, first_name, field_of_study, onboarding_complete
    `;

    const result = await pool.query(query, values);

    res.json({
      message: 'Onboarding completed',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export default router;

