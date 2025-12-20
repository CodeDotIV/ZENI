# Running ZENI Project

## Quick Start

I've started the Frontend and AI Service for you. Here's the status and what you need to do:

## Current Status

### ✅ Started Services
- **Frontend**: http://localhost:3000 (Starting...)
- **AI Service**: http://localhost:8000 (Starting...)

### ❌ Needs Setup
- **Backend API**: Dependencies not installed (npm permission issue)
- **Database**: Docker/Colima not running (needs QEMU)

## What You Need to Do

### 1. Install Backend Dependencies

Due to npm permission issues, run this manually:

```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm install
```

If you get permission errors, try:
```bash
sudo chown -R $(whoami) ~/.npm
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm install
```

### 2. Start Backend API

After dependencies are installed:

```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run dev
```

This will start the backend on http://localhost:3001

### 3. Start Database Services

**Option A: Install QEMU and use Colima**
```bash
brew install qemu
colima start
docker-compose up -d
```

**Option B: Use Docker Desktop**
- Download from: https://www.docker.com/products/docker-desktop
- Start Docker Desktop
- Then run: `docker-compose up -d`

### 4. Run Database Migrations

After Docker is running:

```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run migrate
```

## Using the Startup Scripts

I've created helper scripts for you:

### Start All Services
```bash
./start-services.sh
```

### Stop All Services
```bash
./stop-services.sh
```

### Check Status
```bash
./check-setup.sh
```

## Manual Service Management

### Start Services Individually

**Terminal 1 - Backend:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1/frontend
npm run dev
```

**Terminal 3 - AI Service:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1/ai-service
source venv/bin/activate
python main.py
```

## View Logs

Logs are saved in the `logs/` directory:
```bash
# View backend logs
tail -f logs/backend.log

# View frontend logs
tail -f logs/frontend.log

# View AI service logs
tail -f logs/ai-service.log
```

## Access the Application

Once all services are running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8000

## Troubleshooting

### Backend won't start
- Check if dependencies are installed: `ls backend/node_modules`
- Install: `cd backend && npm install`
- Check logs: `tail -f logs/backend.log`

### Database connection errors
- Start Docker: `colima start` or Docker Desktop
- Verify: `docker ps`
- Run migrations: `cd backend && npm run migrate`

### Port already in use
```bash
# Find what's using the port
lsof -i :3000  # or 3001, 8000

# Kill the process
kill -9 <PID>
```

## Next Steps

1. ✅ Frontend is starting (check http://localhost:3000)
2. ✅ AI Service is starting (check http://localhost:8000/health)
3. ⏳ Install backend dependencies
4. ⏳ Start backend API
5. ⏳ Start Docker and run migrations
6. 🎉 Use ZENI!

