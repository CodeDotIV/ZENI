# ZENI Setup Guide

## Prerequisites

Before starting, ensure you have:
- **Node.js 18+** and npm
- **Python 3.10+** and pip
- **PostgreSQL 14+** (or use Docker)
- **Redis 7+** (or use Docker)
- **Docker & Docker Compose** (recommended)
- **OpenAI API Key** (for AI features)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install AI service dependencies
cd ai-service && pip install -r requirements.txt && cd ..
```

### 2. Start Database Services

Using Docker (recommended):
```bash
docker-compose up -d
```

Or manually:
- Start PostgreSQL on port 5432
- Start Redis on port 6379

### 3. Configure Environment Variables

**Backend:**
```bash
cd backend
cp env.example .env
# Edit .env with your configuration
```

Required variables:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` (use a strong secret in production)
- `REDIS_URL`
- `AI_SERVICE_URL`

**AI Service:**
```bash
cd ai-service
cp .env.example .env
# Add your OPENAI_API_KEY
```

Required variables:
- `OPENAI_API_KEY` (get from https://platform.openai.com/)

### 4. Run Database Migrations

```bash
cd backend
npm run migrate
```

This will create all necessary database tables.

### 5. Start Development Servers

**Option 1: Start all at once (from root)**
```bash
npm run dev
```

**Option 2: Start individually**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

Terminal 3 - AI Service:
```bash
cd ai-service
python main.py
# Runs on http://localhost:8000
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8000

## First Time Setup

1. Open http://localhost:3000
2. Click "Sign Up" to create an account
3. Complete the onboarding flow
4. Start using ZENI!

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps

# Check database connection
psql -h localhost -U postgres -d zeni
```

### Redis Connection Issues

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### Port Already in Use

If ports 3000, 3001, or 8000 are in use:
- Change ports in `.env` files
- Or stop the conflicting services

### AI Service Not Responding

- Verify `OPENAI_API_KEY` is set correctly
- Check AI service logs for errors
- Ensure OpenAI API has credits/quota

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in all `.env` files
2. Use strong `JWT_SECRET`
3. Configure proper CORS origins
4. Set up SSL/TLS
5. Use production database (not local)
6. Configure proper logging and monitoring
7. Set up CI/CD pipeline

## Next Steps

- Read the [PRD.md](./PRD.md) for feature specifications
- Check [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) for implementation details
- Review [FEATURE_SPECIFICATIONS.md](./FEATURE_SPECIFICATIONS.md) for feature logic

## Support

For issues or questions, refer to the documentation files or check the code comments.

