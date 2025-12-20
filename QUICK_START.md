# ZENI Quick Start Guide

## 🚀 Fast Setup (Automated)

Run the setup script:
```bash
./setup.sh
```

This will:
- Install all dependencies
- Set up environment files
- Start Docker services (PostgreSQL & Redis)
- Run database migrations

## 📝 Manual Setup

If the script doesn't work, follow these steps:

### 1. Install Dependencies

```bash
# Root
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# AI Service
cd ai-service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
deactivate
cd ..
```

### 2. Set Up Environment Files

```bash
# Backend
cp backend/env.example backend/.env

# AI Service
cp ai-service/env.example ai-service/.env
# Then edit ai-service/.env and add your OPENAI_API_KEY
```

### 3. Start Database Services

Using Docker:
```bash
docker-compose up -d
```

Or manually start PostgreSQL and Redis.

### 4. Run Migrations

```bash
cd backend
npm run migrate
cd ..
```

### 5. Start Services

**Option 1: All at once (recommended)**
```bash
npm run dev
```

**Option 2: Individually**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Terminal 3 - AI Service:
```bash
cd ai-service
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8000

## 🔑 Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to `ai-service/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

## ✅ Verify Installation

1. Open http://localhost:3000
2. Click "Sign Up" to create an account
3. Complete onboarding
4. Start using ZENI!

## 🐛 Troubleshooting

### npm permission errors
Try:
```bash
sudo npm install
```
Or fix npm permissions:
```bash
sudo chown -R $(whoami) ~/.npm
```

### Port already in use
Change ports in `.env` files or stop conflicting services.

### Database connection errors
- Check if PostgreSQL is running: `docker ps`
- Verify connection: `psql -h localhost -U postgres -d zeni`

### AI Service not working
- Verify `OPENAI_API_KEY` is set in `ai-service/.env`
- Check API key has credits/quota
- View logs: `cd ai-service && python main.py`

## 📚 Next Steps

- Read [SETUP.md](./SETUP.md) for detailed setup
- Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for file structure
- Review [PRD.md](./PRD.md) for feature documentation

