import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { createClient } from 'redis';

// Import routes
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import chatRoutes from './routes/chat.js';
import reminderRoutes from './routes/reminders.js';
import scheduleRoutes from './routes/schedules.js';
import mentalHealthRoutes from './routes/mentalHealth.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ZENI API is running' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/reminders', authenticateToken, reminderRoutes);
app.use('/api/schedules', authenticateToken, scheduleRoutes);
app.use('/api/mental-health', authenticateToken, mentalHealthRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize Redis connection for queues (optional)
export let redisClient = null;
try {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  redisClient.on('error', (err) => {
    // Only log once, not spam
    if (!redisClient._errorLogged) {
      console.warn('⚠️  Redis not available. Continuing without it.');
      redisClient._errorLogged = true;
    }
  });
  redisClient.on('connect', () => console.log('✅ Redis connected'));
} catch (error) {
  console.warn('⚠️  Redis not available. Some features may be limited:', error.message);
}

// Start server
const startServer = async () => {
  try {
    // Try to connect to Redis, but don't fail if it's not available
    if (redisClient) {
      try {
        await redisClient.connect();
      } catch (redisError) {
        console.warn('⚠️  Could not connect to Redis. Continuing without it:', redisError.message);
        redisClient = null;
      }
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 ZENI Backend running on port ${PORT}`);
      console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
      if (!redisClient) {
        console.log('ℹ️  Running without Redis (reminders queue disabled)');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

