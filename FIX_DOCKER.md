# Quick Fix for Docker/Colima Issue

## The Problem
Colima needs QEMU to run, but it's not installed on your system.

## Solution: Install QEMU

Run this command in your terminal:
```bash
brew install qemu
```

**Note**: If you get permission errors, you may need to fix Homebrew permissions first:
```bash
sudo chown -R $(whoami) /opt/homebrew/Cellar
```

## After Installing QEMU

1. Start Colima:
```bash
colima start
```

2. Verify it's running:
```bash
colima status
docker ps
```

3. Start ZENI services:
```bash
cd /Users/yellutla1.kumar/Desktop/app1
docker-compose up -d
```

## Alternative: Use Docker Desktop

If you prefer not to install QEMU:
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. It will automatically replace Colima
4. Then run: `docker-compose up -d`

## Current Status

✅ Frontend dependencies: Installed
✅ AI service dependencies: Installed  
✅ Environment files: Configured
❌ Backend dependencies: Need to install
❌ Docker services: Need QEMU or Docker Desktop

## Next Steps After Fixing Docker

1. Install backend dependencies:
```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm install
```

2. Start Docker services:
```bash
cd /Users/yellutla1.kumar/Desktop/app1
docker-compose up -d
```

3. Run migrations:
```bash
cd backend
npm run migrate
```

4. Start all services (see MANUAL_SETUP.md)

