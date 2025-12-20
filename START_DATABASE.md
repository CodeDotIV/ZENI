# Start Database for Backend API

## Current Issue
The backend API returns "Internal Server Error" because PostgreSQL is not running.

## Quick Fix

### Step 1: Start PostgreSQL

**Option A: Using Docker (Recommended)**
```bash
cd /Users/yellutla1.kumar/Desktop/app1
docker-compose up -d postgres
```

**If Docker is not running:**
- Start Docker Desktop, OR
- Install QEMU and start Colima:
  ```bash
  brew install qemu
  colima start
  docker-compose up -d postgres
  ```

**Option B: Use Local PostgreSQL**
If you have PostgreSQL installed locally:
```bash
# Start PostgreSQL service
brew services start postgresql@14

# Create database
createdb zeni
```

### Step 2: Run Database Migrations
```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run migrate
```

This will create all necessary tables.

### Step 3: Verify Backend .env File
Make sure `backend/.env` exists with:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zeni
DB_USER=postgres
DB_PASSWORD=postgres
```

### Step 4: Restart Backend
```bash
# Stop current backend (Ctrl+C)
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run dev
```

### Step 5: Test Registration
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

## Current Error Response
The backend now returns a helpful error message:
```json
{
  "error": "Database not available. Please start PostgreSQL.",
  "details": "Run: docker-compose up -d postgres && cd backend && npm run migrate"
}
```

## Verify Database is Running
```bash
# Check Docker containers
docker ps | grep postgres

# Or test connection
psql -h localhost -U postgres -d zeni -c "SELECT 1;"
```

---

**Once PostgreSQL is running and migrations are complete, the registration endpoint will work!**

