# ZENI Manual Setup Instructions

Due to system permission restrictions, please follow these manual setup steps:

## Step 1: Install Dependencies

### Backend Dependencies
```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm install
```

### Frontend Dependencies
```bash
cd /Users/yellutla1.kumar/Desktop/app1/frontend
npm install
```

### AI Service Dependencies
```bash
cd /Users/yellutla1.kumar/Desktop/app1/ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
```

**Note**: If you encounter permission errors with npm, try:
```bash
sudo npm install
```
Or fix npm permissions:
```bash
sudo chown -R $(whoami) ~/.npm
```

## Step 2: Set Up Environment Files

### Backend Environment
```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
cp env.example .env
```

The `.env` file should contain:
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zeni
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=zeni-super-secret-jwt-key-change-in-production-2024
REDIS_URL=redis://localhost:6379
AI_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### AI Service Environment
```bash
cd /Users/yellutla1.kumar/Desktop/app1/ai-service
cp env.example .env
```

Then edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Get your OpenAI API key**: https://platform.openai.com/api-keys

## Step 3: Start Database Services

### Option A: Using Docker (Recommended)
```bash
cd /Users/yellutla1.kumar/Desktop/app1
docker-compose up -d
```

**If Docker is not running**, start Docker Desktop first, then run the command above.

### Option B: Manual Setup
Start PostgreSQL and Redis manually on your system.

## Step 4: Run Database Migrations

```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run migrate
```

This will create all necessary database tables.

## Step 5: Start All Services

You'll need **3 terminal windows**:

### Terminal 1 - Backend API
```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run dev
```
Backend will run on: http://localhost:3001

### Terminal 2 - Frontend
```bash
cd /Users/yellutla1.kumar/Desktop/app1/frontend
npm run dev
```
Frontend will run on: http://localhost:3000

### Terminal 3 - AI Service
```bash
cd /Users/yellutla1.kumar/Desktop/app1/ai-service
source venv/bin/activate
python main.py
```
AI Service will run on: http://localhost:8000

## Step 6: Access the Application

1. Open your browser and go to: **http://localhost:3000**
2. Click "Sign Up" to create a new account
3. Complete the onboarding flow
4. Start using ZENI!

## Verification Checklist

- [ ] Backend dependencies installed (`cd backend && npm list`)
- [ ] Frontend dependencies installed (`cd frontend && npm list`)
- [ ] AI service dependencies installed (`cd ai-service && source venv/bin/activate && pip list`)
- [ ] Backend `.env` file created and configured
- [ ] AI service `.env` file created with OpenAI API key
- [ ] Docker services running (`docker ps` should show postgres and redis)
- [ ] Database migrations completed (`npm run migrate` in backend)
- [ ] Backend API running (http://localhost:3001/health)
- [ ] Frontend running (http://localhost:3000)
- [ ] AI service running (http://localhost:8000/health)

## Troubleshooting

### npm Permission Errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use sudo (not recommended for production)
sudo npm install
```

### Docker Not Running
- Start Docker Desktop application
- Wait for it to fully start
- Then run `docker-compose up -d`

### Port Already in Use
If ports 3000, 3001, or 8000 are in use:
- Find the process: `lsof -i :3000` (or 3001, 8000)
- Kill the process or change ports in `.env` files

### Database Connection Errors
```bash
# Check if PostgreSQL is running
docker ps

# Test connection
psql -h localhost -U postgres -d zeni
```

### AI Service Errors
- Verify `OPENAI_API_KEY` is set correctly in `ai-service/.env`
- Check OpenAI API has credits/quota
- View error logs in the terminal running the AI service

### Python Virtual Environment Issues
```bash
# Recreate virtual environment
cd ai-service
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Quick Commands Reference

```bash
# Start all services (if using npm workspaces)
cd /Users/yellutla1.kumar/Desktop/app1
npm run dev

# Stop Docker services
docker-compose down

# View Docker logs
docker-compose logs

# Reset database (WARNING: deletes all data)
cd backend
npm run migrate  # Re-runs migrations
```

## Next Steps

Once everything is running:
1. Create your account at http://localhost:3000
2. Complete onboarding
3. Try uploading a syllabus (if you have one)
4. Chat with ZENI to test the AI features
5. Create some tasks and see the schedule generation

For more details, see:
- [SETUP.md](./SETUP.md) - Detailed setup guide
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [README.md](./README.md) - Project overview

