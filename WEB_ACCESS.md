# ZENI Web Access Guide

## 🌐 Access Your Application

Once services are running, access ZENI at:

### **Main Application**
**http://localhost:3000**

This is your main ZENI interface where you can:
- Sign up or log in
- Complete onboarding
- View your dashboard
- Chat with ZENI
- Manage tasks and schedules

### **API Endpoints**
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **AI Service**: http://localhost:8000
- **AI Health Check**: http://localhost:8000/health

## 🚀 Starting Services

### Quick Start (All Services)
```bash
cd /Users/yellutla1.kumar/Desktop/app1
./start-services.sh
```

### Manual Start (Individual Services)

**Terminal 1 - Frontend:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1/frontend
npm run dev
```
Access at: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm run dev
```
Runs on: http://localhost:3001

**Terminal 3 - AI Service:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1/ai-service
source venv/bin/activate
python main.py
```
Runs on: http://localhost:8000

## ✅ Verify Services Are Running

### Check Frontend
Open in browser: http://localhost:3000

Or check via terminal:
```bash
curl http://localhost:3000
```

### Check Backend
```bash
curl http://localhost:3001/health
```
Should return: `{"status":"ok","message":"ZENI API is running"}`

### Check AI Service
```bash
curl http://localhost:8000/health
```
Should return: `{"status":"ok","service":"ZENI AI Service"}`

## 🎯 First Time Setup

1. **Open your browser** and go to: **http://localhost:3000**

2. **Sign Up**:
   - Click "Sign Up" or "Get Started"
   - Enter your email and password
   - Create your account

3. **Complete Onboarding**:
   - Answer a few simple questions
   - Tell ZENI about yourself
   - No complex setup needed!

4. **Start Using ZENI**:
   - View your dashboard
   - Chat with ZENI
   - Create tasks
   - Upload your syllabus (optional)

## 🐛 Troubleshooting

### Frontend Not Loading

**Check if it's running:**
```bash
lsof -i :3000
```

**Start it:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1/frontend
npm run dev
```

**Check logs:**
```bash
tail -f logs/frontend.log
```

### Backend Not Responding

**Check if it's running:**
```bash
lsof -i :3001
```

**Install dependencies first:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1/backend
npm install
```

**Then start it:**
```bash
npm run dev
```

### AI Service Not Working

**Check if it's running:**
```bash
lsof -i :8000
```

**Start it:**
```bash
cd /Users/yellutla1.kumar/Desktop/app1/ai-service
source venv/bin/activate
python main.py
```

**Verify API key:**
Make sure `ai-service/.env` has your OpenAI API key:
```
OPENAI_API_KEY=sk-your-key-here
```

### Port Already in Use

If you get "port already in use" error:

```bash
# Find what's using the port
lsof -i :3000  # or 3001, 8000

# Kill the process
kill -9 <PID>
```

Or change the port in `.env` files.

## 📱 Mobile Access (Same Network)

If you want to access from your phone/tablet on the same network:

1. Find your computer's IP address:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

2. Access from mobile browser:
```
http://YOUR_IP_ADDRESS:3000
```

Example: `http://192.168.1.100:3000`

## 🔒 Production Deployment

For production deployment, you'll need to:
1. Set `NODE_ENV=production`
2. Build the frontend: `cd frontend && npm run build`
3. Use a reverse proxy (nginx)
4. Set up SSL/HTTPS
5. Configure proper CORS
6. Use production database

## 📊 Service Status

Check all services at once:
```bash
./check-setup.sh
```

View running processes:
```bash
ps aux | grep -E "(next|node|python)" | grep -v grep
```

## 🎉 You're Ready!

Open **http://localhost:3000** in your browser and start using ZENI!

