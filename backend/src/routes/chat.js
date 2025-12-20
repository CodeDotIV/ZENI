import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../database/connection.js';
import axios from 'axios';

const router = express.Router();

// Send chat message
router.post('/', [
  body('message').notEmpty().trim(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { message } = req.body;

    // Save user message
    const messageResult = await pool.query(
      `INSERT INTO chat_messages (user_id, message)
       VALUES ($1, $2)
       RETURNING id, created_at`,
      [userId, message]
    );

    const messageId = messageResult.rows[0].id;

    // Get user context
    const userResult = await pool.query(
      'SELECT first_name, field_of_study, preferences FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    // Get recent conversation history
    const historyResult = await pool.query(
      `SELECT message, response, created_at
       FROM chat_messages
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );

    // Call AI service for empathetic response
    let aiResponse;
    let sentiment = 'neutral';
    let emotions = [];
    let crisisDetected = false;
    let crisisSeverity = 'low';

    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const aiResponseData = await axios.post(`${aiServiceUrl}/api/chat`, {
        message,
        user_context: {
          first_name: user.first_name,
          field_of_study: user.field_of_study,
          preferences: user.preferences
        },
        conversation_history: historyResult.rows.reverse()
      });

      aiResponse = aiResponseData.data.response;
      sentiment = aiResponseData.data.sentiment || 'neutral';
      emotions = aiResponseData.data.emotions || [];
      crisisDetected = aiResponseData.data.crisis_detected || false;
      crisisSeverity = aiResponseData.data.crisis_severity || 'low';
    } catch (error) {
      console.error('AI service error:', error);
      // Fallback response
      aiResponse = "I'm here to help! Can you tell me more about what's on your mind?";
    }

    // Update message with response
    await pool.query(
      `UPDATE chat_messages
       SET response = $1, sentiment = $2, emotions = $3, 
           crisis_detected = $4, crisis_severity = $5
       WHERE id = $6`,
      [aiResponse, sentiment, JSON.stringify(emotions), crisisDetected, crisisSeverity, messageId]
    );

    // If crisis detected, log it
    if (crisisDetected) {
      // Could trigger additional actions here (notify support, etc.)
      console.warn(`Crisis detected for user ${userId}: ${crisisSeverity}`);
    }

    res.json({
      message_id: messageId,
      response: aiResponse,
      sentiment,
      emotions,
      crisis_detected: crisisDetected,
      resources: crisisDetected ? getCrisisResources() : null
    });
  } catch (error) {
    next(error);
  }
});

// Get chat history
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { limit = 50 } = req.query;

    const result = await pool.query(
      `SELECT id, message, response, sentiment, emotions, crisis_detected, created_at
       FROM chat_messages
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.json({ messages: result.rows.reverse() });
  } catch (error) {
    next(error);
  }
});

function getCrisisResources() {
  return {
    crisis_text_line: 'Text HOME to 741741',
    suicide_prevention: '988',
    message: 'Your safety is important. Please reach out to someone you trust or a professional.'
  };
}

export default router;

