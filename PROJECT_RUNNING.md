# 🚀 ZENI Project is Running!

## ✅ Services Started

I've started all three services for you:

### 🌐 **Main Application**
**👉 http://localhost:3000 👈**

**Open this in your browser to use ZENI!**

### 📡 **Backend API**
**http://localhost:3001**
- Health check: http://localhost:3001/health
- API endpoints: http://localhost:3001/api/*

### 🤖 **AI Service**
**http://localhost:8000**
- Health check: http://localhost:8000/health

## 🎯 What to Do Now

1. **Open your browser** and go to: **http://localhost:3000**

2. **Sign Up**:
   - Click "Sign Up" or "Get Started"
   - Create your account with email and password

3. **Complete Onboarding**:
   - Answer a few simple questions
   - Tell ZENI about yourself

4. **Start Using ZENI**:
   - View your dashboard
   - Chat with ZENI (AI companion)
   - Create tasks
   - Upload your syllabus (optional)

## 📊 Service Status

Check if services are running:

```bash
# Frontend
curl http://localhost:3000

# Backend
curl http://localhost:3001/health

# AI Service
curl http://localhost:8000/health
```

## 🛑 Stop Services

To stop all services:

```bash
./stop-services.sh
```

Or manually:
- Press `Ctrl+C` in each terminal running the services
- Or find and kill the processes:
  ```bash
  lsof -i :3000  # Frontend
  lsof -i :3001  # Backend
  lsof -i :8000  # AI Service
  kill -9 <PID>
  ```

## 📝 View Logs

Logs are saved in the `logs/` directory:

```bash
# View backend logs
tail -f logs/backend.log

# View frontend logs
tail -f logs/frontend.log

# View AI service logs
tail -f logs/ai-service.log
```

## 🐛 Troubleshooting

### Frontend not loading?
- Check: `curl http://localhost:3000`
- Restart: `cd frontend && npm run dev`

### Backend not responding?
- Check: `curl http://localhost:3001/health`
- Restart: `cd backend && npm run dev`

### AI Service not working?
- Check: `curl http://localhost:8000/health`
- Verify OpenAI API key in `ai-service/.env`
- Restart: `cd ai-service && source venv/bin/activate && python main.py`

### Port already in use?
```bash
# Find what's using the port
lsof -i :3000  # or 3001, 8000

# Kill the process
kill -9 <PID>
```

## 🎉 You're All Set!

**Open http://localhost:3000 in your browser and start using ZENI!**

---

**Note**: The services are running in the background. They will continue running until you stop them or close the terminal.

