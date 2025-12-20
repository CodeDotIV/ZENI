# ZENI - AI-Powered Student Organizer & Mental Health Companion

> "A caring friend who organizes your life without you having to think about it."

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose (optional)

### Installation

1. **Clone and install dependencies:**
```bash
npm run install:all
cd ai-service && pip install -r requirements.txt
```

2. **Start database services:**
```bash
docker-compose up -d
```

3. **Set up environment variables:**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# AI Service
cp ai-service/.env.example ai-service/.env
# Add your OPENAI_API_KEY to ai-service/.env
```

4. **Run database migrations:**
```bash
cd backend && npm run migrate
```

5. **Start all services:**
```bash
# From root directory
npm run dev

# Or start individually:
npm run dev:backend    # Backend API (port 3001)
npm run dev:frontend   # Frontend (port 3000)
# AI Service: cd ai-service && python main.py (port 8000)
```

## 📁 Project Structure

```
app1/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, error handling
│   │   ├── database/    # DB connection & migrations
│   │   └── utils/       # Utility functions
│   └── package.json
├── frontend/             # Next.js web app
│   ├── app/             # Next.js app directory
│   └── package.json
├── ai-service/           # Python FastAPI service
│   ├── main.py          # AI service entry point
│   └── requirements.txt
├── docker-compose.yml    # Database & Redis setup
└── README.md
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, Redis, Bull (queues)
- **Frontend**: Next.js 14, React, Tailwind CSS
- **AI Service**: Python, FastAPI, OpenAI GPT-4
- **Database**: PostgreSQL
- **Cache/Queue**: Redis

## 📚 Documentation

- **[PRD.md](./PRD.md)** - Complete Product Requirement Document
- **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)** - Technical implementation details
- **[USER_JOURNEY_MAP.md](./USER_JOURNEY_MAP.md)** - User personas & journeys
- **[FEATURE_SPECIFICATIONS.md](./FEATURE_SPECIFICATIONS.md)** - Detailed feature specs

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/onboarding` - Complete onboarding

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/bulk` - Bulk create tasks

### Chat
- `POST /api/chat` - Send message to ZENI
- `GET /api/chat` - Get chat history

### Schedules
- `GET /api/schedules/:date` - Get schedule for date
- `POST /api/schedules/generate` - Generate schedule

### Mental Health
- `POST /api/mental-health/checkin` - Create check-in
- `GET /api/mental-health/insights` - Get insights

## 🧪 Development

### Backend
```bash
cd backend
npm run dev        # Development server
npm run migrate    # Run migrations
```

### Frontend
```bash
cd frontend
npm run dev        # Development server
npm run build     # Production build
```

### AI Service
```bash
cd ai-service
python main.py     # Run FastAPI server
```

## 🐳 Docker

Start all services:
```bash
docker-compose up -d
```

Stop services:
```bash
docker-compose down
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zeni
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
AI_SERVICE_URL=http://localhost:8000
```

### AI Service (.env)
```
OPENAI_API_KEY=your-openai-api-key
```

## 🎯 Features Implemented

- ✅ User authentication (register/login)
- ✅ Task management (CRUD)
- ✅ AI-powered chat (empathetic responses)
- ✅ Syllabus parsing (AI extraction)
- ✅ Schedule generation
- ✅ Mental health check-ins
- ✅ Reminder system (basic)

## 🚧 Coming Soon

- [ ] Advanced schedule optimization
- [ ] Email integration
- [ ] Voice reminders
- [ ] Mobile app (React Native)
- [ ] Advanced learning system
- [ ] Crisis intervention protocols

## 📄 License

[To be determined]

## 🤝 Contributing

This is a startup project. For contributions, see the PRD for feature specifications.

---

**Status**: MVP Development  
**Last Updated**: 2024
