# Docker Setup for ZENI

## Issue: Colima needs QEMU

Your system is using Colima for Docker, but QEMU is not installed. Here are your options:

## Option 1: Install QEMU for Colima (Recommended)

```bash
# Install QEMU using Homebrew
brew install qemu

# Then start Colima
colima start

# Verify it's running
colima status
```

## Option 2: Use Docker Desktop Instead

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Docker Desktop will replace Colima automatically
4. Then run: `docker-compose up -d`

## Option 3: Manual Database Setup (No Docker)

If you prefer not to use Docker, you can set up PostgreSQL and Redis manually:

### Install PostgreSQL
```bash
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb zeni
```

### Install Redis
```bash
brew install redis
brew services start redis
```

Then update `backend/.env` to use your local PostgreSQL:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zeni
DB_USER=your_username
DB_PASSWORD=
```

## Quick Fix: Install QEMU

Run this command:
```bash
brew install qemu
```

Then:
```bash
colima start
docker-compose up -d
```

## Verify Docker is Working

After setting up Docker (any method), verify:
```bash
docker ps
docker-compose ps
```

You should see your containers running.

