# API Registration Test Result

## Current Status
The `/api/auth/register` endpoint is returning "Internal Server Error" because **PostgreSQL database is not running**.

## The Problem
- Backend API is running on http://localhost:3001
- Database connection is failing (PostgreSQL not started)
- Registration endpoint requires database to work

## Solution

### Step 1: Start PostgreSQL Database
```bash
cd /Users/yellutla1.kumar/Desktop/app1

# Start Docker (if using Docker)
docker-compose up -d postgres

# OR if Docker is not running:
# 1. Start Docker Desktop, OR
# 2. Install QEMU and start Colima:
brew install qemu
colima start
docker-compose up -d postgres
```

### Step 2: Run Database Migrations
```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run migrate
```

This creates all the database tables needed.

### Step 3: Restart Backend (if needed)
The backend should auto-restart with nodemon, but if not:
```bash
# Stop backend (Ctrl+C in terminal running it)
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run dev
```

### Step 4: Test Registration Again
```bash
curl 'http://localhost:3001/api/auth/register' \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"123@gmail.com","password":"123456","first_name":"123"}'
```

## Expected Response (After Database is Running)
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid-here",
    "email": "123@gmail.com",
    "first_name": "123",
    "onboarding_complete": false
  },
  "token": "jwt-token-here"
}
```

## Current Error
The backend is trying to connect to PostgreSQL but can't because:
- Docker/PostgreSQL is not running
- Database `zeni` doesn't exist
- Tables haven't been created

## Quick Check
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Or test connection
psql -h localhost -U postgres -d zeni -c "SELECT 1;"
```

## What I've Fixed
✅ Added better error handling to registration endpoint
✅ Created backend `.env` file
✅ Added database connection check

**The backend will now give a clearer error message once restarted, but you still need to start PostgreSQL for it to work.**

---

**Start PostgreSQL and run migrations, then the registration will work!** 🚀

