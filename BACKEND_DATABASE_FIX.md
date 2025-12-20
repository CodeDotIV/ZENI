# Backend Database Connection Fix

## Issue
The backend API is returning "Internal Server Error" because it can't connect to the database.

## Quick Fix

### Option 1: Start PostgreSQL with Docker (Recommended)
```bash
cd /Users/yellutla1.kumar/Desktop/app1
docker-compose up -d postgres
```

Wait a few seconds, then:
```bash
cd backend
npm run migrate
```

### Option 2: Check Database Connection
The backend is trying to connect to PostgreSQL. Make sure:
1. PostgreSQL is running
2. Database `zeni` exists
3. Migrations have been run

### Option 3: Test Database Connection
```bash
# Check if PostgreSQL is accessible
psql -h localhost -U postgres -d zeni -c "SELECT 1;"
```

## Current Error
The `/api/auth/register` endpoint is failing because:
- Database connection is not established
- Or database tables don't exist

## Steps to Fix

1. **Start PostgreSQL:**
```bash
docker-compose up -d postgres
```

2. **Run migrations:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run migrate
```

3. **Restart backend:**
```bash
# Stop current backend (Ctrl+C in terminal)
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run dev
```

4. **Test registration again:**
```bash
curl 'http://localhost:3001/api/auth/register' \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"123@gmail.com","password":"123456","first_name":"123"}'
```

## Expected Response (After Fix)
```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "email": "123@gmail.com",
    "first_name": "123",
    "onboarding_complete": false
  },
  "token": "..."
}
```

## Database Configuration
Check `backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zeni
DB_USER=postgres
DB_PASSWORD=postgres
```

Make sure these match your PostgreSQL setup.

