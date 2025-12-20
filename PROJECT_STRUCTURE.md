# ZENI Project Structure

## 📁 Complete File Structure

```
app1/
├── 📄 Documentation
│   ├── PRD.md                          # Product Requirement Document
│   ├── TECHNICAL_ARCHITECTURE.md       # Technical implementation details
│   ├── USER_JOURNEY_MAP.md            # User personas & journeys
│   ├── FEATURE_SPECIFICATIONS.md      # Detailed feature specs
│   ├── README.md                       # Main README
│   ├── SETUP.md                        # Setup instructions
│   └── PROJECT_STRUCTURE.md            # This file
│
├── 🎯 Root Configuration
│   ├── package.json                    # Workspace configuration
│   ├── docker-compose.yml             # Database & Redis setup
│   └── .gitignore                     # Git ignore rules
│
├── 🔧 Backend (Node.js/Express)
│   └── backend/
│       ├── package.json
│       ├── env.example                 # Environment variables template
│       └── src/
│           ├── index.js                # Main server entry point
│           ├── database/
│           │   ├── connection.js       # PostgreSQL connection
│           │   ├── schema.sql         # Database schema
│           │   └── migrate.js         # Migration script
│           ├── middleware/
│           │   ├── auth.js             # JWT authentication
│           │   └── errorHandler.js    # Error handling
│           ├── routes/
│           │   ├── auth.js             # Authentication routes
│           │   ├── tasks.js            # Task management routes
│           │   ├── chat.js             # Chat/AI routes
│           │   ├── schedules.js        # Schedule routes
│           │   ├── reminders.js        # Reminder routes
│           │   └── mentalHealth.js    # Mental health routes
│           └── utils/
│               ├── taskUtils.js        # Task utilities
│               └── scheduleUtils.js    # Schedule utilities
│
├── 🎨 Frontend (Next.js/React)
│   └── frontend/
│       ├── package.json
│       ├── next.config.js              # Next.js configuration
│       ├── tailwind.config.js         # Tailwind CSS config
│       ├── postcss.config.js          # PostCSS config
│       └── app/
│           ├── layout.js               # Root layout
│           ├── globals.css             # Global styles
│           ├── page.js                 # Landing page
│           ├── login/
│           │   └── page.js             # Login/Signup page
│           ├── onboarding/
│           │   └── page.js             # Onboarding flow
│           ├── dashboard/
│           │   └── page.js             # Main dashboard
│           └── chat/
│               └── page.js             # Chat interface
│
└── 🤖 AI Service (Python/FastAPI)
    └── ai-service/
        ├── requirements.txt            # Python dependencies
        ├── env.example                # Environment variables template
        └── main.py                    # FastAPI application
```

## 🚀 Quick Start Commands

```bash
# Install all dependencies
npm run install:all
cd ai-service && pip install -r requirements.txt && cd ..

# Start database services
docker-compose up -d

# Run migrations
cd backend && npm run migrate && cd ..

# Start all services
npm run dev

# Or start individually:
npm run dev:backend    # Port 3001
npm run dev:frontend   # Port 3000
# AI Service: cd ai-service && python main.py  # Port 8000
```

## 📊 Database Schema

The database includes:
- **users** - User accounts and preferences
- **courses** - Course information
- **tasks** - Tasks and assignments
- **schedules** - Daily schedules
- **time_blocks** - Individual time blocks
- **chat_messages** - Chat history
- **reminders** - Scheduled reminders
- **mental_health_checkins** - Mental health tracking
- **user_learning_patterns** - AI learning data
- **syllabus_uploads** - Syllabus processing

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/onboarding` - Complete onboarding

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/bulk` - Bulk create

### Chat
- `POST /api/chat` - Send message
- `GET /api/chat` - Get history

### Schedules
- `GET /api/schedules/:date` - Get schedule
- `POST /api/schedules/generate` - Generate schedule

### Mental Health
- `POST /api/mental-health/checkin` - Create check-in
- `GET /api/mental-health/insights` - Get insights

## 🎯 Features Implemented

✅ **Authentication & Authorization**
- User registration and login
- JWT token-based auth
- Onboarding flow

✅ **Task Management**
- CRUD operations
- Priority calculation
- Bulk task creation
- Task status tracking

✅ **AI Chat**
- Empathetic responses
- Sentiment analysis
- Emotion detection
- Crisis detection

✅ **Schedule Generation**
- AI-powered scheduling
- Time blocking
- Priority-based allocation

✅ **Mental Health**
- Check-ins
- Insights tracking
- Stress level monitoring

✅ **Frontend UI**
- Landing page
- Login/Signup
- Dashboard
- Chat interface
- Onboarding flow

## 🔄 Next Steps

1. **Set up environment variables** (see SETUP.md)
2. **Start database services** (`docker-compose up -d`)
3. **Run migrations** (`cd backend && npm run migrate`)
4. **Start all services** (`npm run dev`)
5. **Access the app** at http://localhost:3000

## 📝 Notes

- All services use environment variables for configuration
- Database migrations are in `backend/src/database/schema.sql`
- AI service requires OpenAI API key
- Frontend uses Tailwind CSS for styling
- Backend uses Express with PostgreSQL
- AI service uses FastAPI with OpenAI GPT-4

## 🐛 Troubleshooting

See [SETUP.md](./SETUP.md) for detailed troubleshooting guide.

