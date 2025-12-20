# Database Setup Options

## Current Issue
Colima needs QEMU to run, but it's not installed. You have 3 options:

## Option 1: Install QEMU for Colima (Recommended)

```bash
# Install QEMU
brew install qemu

# Start Colima
colima start

# Start PostgreSQL
cd /Users/yellutla1.kumar/Desktop/app1
docker-compose up -d postgres

# Wait a few seconds, then run migrations
cd backend
npm run migrate
```

## Option 2: Use Docker Desktop

1. **Download Docker Desktop**: https://www.docker.com/products/docker-desktop
2. **Install and start Docker Desktop**
3. **Then run:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1
docker-compose up -d postgres
cd backend
npm run migrate
```

## Option 3: Install PostgreSQL Locally (No Docker)

```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Create database
createdb zeni

# Update backend/.env to use local PostgreSQL
# (It should already be configured correctly)

# Run migrations
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run migrate
```

## Quick Fix: Install QEMU

Run this command:
```bash
brew install qemu
```

Then:
```bash
colima start
cd /Users/yellutla1.kumar/Desktop/app1
docker-compose up -d postgres
cd backend
npm run migrate
```

## Verify Database is Running

After starting PostgreSQL:
```bash
# Check Docker container
docker ps | grep postgres

# Or test connection
psql -h localhost -U postgres -d zeni -c "SELECT 1;"
```

## Test Registration After Database is Running

```bash
curl 'http://localhost:3001/api/auth/register' \
  -H 'Content-Type: application/json' \
  --data-raw '{"email":"123@gmail.com","password":"123456","first_name":"123"}'
```

You should get a success response with user data and token.

---

**Choose one of the options above to get PostgreSQL running!**

