# ZENI - Technical Architecture Document

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  iOS App     │  │  Android App │  │  Web App     │      │
│  │  (React      │  │  (React      │  │  (Next.js)   │      │
│  │   Native)    │  │   Native)    │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │  (Kong/AWS API) │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  Auth Service  │  │  Task Service   │  │  Chat Service  │
│  (JWT/OAuth)   │  │  (Node.js)      │  │  (Node.js)     │
└────────────────┘  └────────┬────────┘  └───────┬────────┘
                             │                    │
                    ┌────────▼────────────────────▼────────┐
                    │      AI/ML Service Layer             │
                    │  ┌──────────────────────────────┐   │
                    │  │  LLM Integration (GPT-4/Claude│   │
                    │  │  - Task Extraction           │   │
                    │  │  - Empathetic Conversations  │   │
                    │  │  - Schedule Optimization     │   │
                    │  └──────────────────────────────┘   │
                    │  ┌──────────────────────────────┐   │
                    │  │  OCR Service (Tesseract/     │   │
                    │  │  Google Vision)              │   │
                    │  └──────────────────────────────┘   │
                    │  ┌──────────────────────────────┐   │
                    │  │  NLP Pipeline (spaCy/        │   │
                    │  │  Transformers)               │   │
                    │  └──────────────────────────────┘   │
                    └────────┬────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  PostgreSQL    │  │  MongoDB        │  │  Redis Cache   │
│  (Structured)  │  │  (Chat Logs)    │  │  (Sessions)     │
└────────────────┘  └─────────────────┘  └────────────────┘
```

## Core Services

### 1. Authentication Service

**Technology**: Node.js + Express, JWT tokens

**Responsibilities**:
- User registration/login
- OAuth integration (Google, Apple)
- Session management
- Password reset

**Endpoints**:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
```

### 2. Task Management Service

**Technology**: Node.js + Express, PostgreSQL

**Responsibilities**:
- CRUD operations for tasks
- Task prioritization logic
- Deadline tracking
- Schedule generation

**Database Schema**:
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP,
    priority INTEGER, -- 1-10
    status VARCHAR(20), -- pending, in_progress, completed, missed
    estimated_time INTEGER, -- minutes
    actual_time INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    ai_generated BOOLEAN DEFAULT false
);

CREATE TABLE schedules (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    time_blocks JSONB, -- Array of {task_id, start_time, end_time}
    created_at TIMESTAMP
);
```

**Endpoints**:
```
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/tasks/schedule/:date
POST   /api/tasks/generate-schedule
```

### 3. AI/ML Service

**Technology**: Python (FastAPI), OpenAI/Anthropic API

**Responsibilities**:
- Syllabus parsing and task extraction
- Empathetic conversation generation
- Schedule optimization
- Emotion detection

**Key Components**:

#### 3.1 Syllabus Parser
```python
class SyllabusParser:
    def __init__(self):
        self.ocr = TesseractOCR()
        self.llm = OpenAI()
    
    def parse(self, pdf_path: str) -> dict:
        # 1. Extract text using OCR
        text = self.ocr.extract_text(pdf_path)
        
        # 2. Use LLM to structure data
        prompt = f"""
        Extract from this syllabus:
        - Course name
        - Assignments with deadlines
        - Exam dates
        - Reading schedules
        
        Return as JSON.
        """
        structured_data = self.llm.extract(prompt, text)
        return structured_data
```

#### 3.2 Empathetic Chatbot
```python
class EmpatheticChatbot:
    def __init__(self):
        self.llm = OpenAI(model="gpt-4")
        self.sentiment_analyzer = SentimentAnalyzer()
    
    def respond(self, user_message: str, context: dict) -> str:
        # Analyze sentiment
        sentiment = self.sentiment_analyzer.analyze(user_message)
        
        # Generate empathetic response
        prompt = f"""
        You are ZENI, an empathetic AI student companion.
        User sentiment: {sentiment}
        User context: {context}
        User message: {user_message}
        
        Respond with warmth, validation, and support.
        Do not be robotic or judgmental.
        """
        response = self.llm.generate(prompt)
        return response
```

#### 3.3 Schedule Optimizer
```python
class ScheduleOptimizer:
    def optimize(self, tasks: List[Task], user_preferences: dict) -> Schedule:
        # Priority scoring
        for task in tasks:
            urgency = self.calculate_urgency(task.deadline)
            stress = user_preferences.get('stress_level', 5)
            task.priority_score = (urgency * 0.6) + (stress * 0.4)
        
        # Time blocking
        schedule = self.create_time_blocks(
            tasks=sorted(tasks, key=lambda t: t.priority_score, reverse=True),
            available_time=user_preferences['available_hours'],
            energy_levels=user_preferences['energy_patterns']
        )
        
        return schedule
```

**Endpoints**:
```
POST /api/ai/parse-syllabus
POST /api/ai/chat
POST /api/ai/optimize-schedule
POST /api/ai/detect-emotion
```

### 4. Reminder Service

**Technology**: Node.js, Bull (Redis-based queue)

**Responsibilities**:
- Schedule reminders
- Context-aware reminder generation
- Multi-channel delivery (push, email, SMS)

**Implementation**:
```javascript
class ReminderService {
    async scheduleReminder(task, user) {
        const reminderTime = this.calculateOptimalReminderTime(task, user);
        
        await this.queue.add('send-reminder', {
            taskId: task.id,
            userId: user.id,
            reminderTime,
            tone: this.determineTone(user.stressLevel, task.urgency)
        }, {
            delay: reminderTime - Date.now()
        });
    }
    
    async sendReminder(job) {
        const { taskId, userId, tone } = job.data;
        const task = await Task.findById(taskId);
        const user = await User.findById(userId);
        
        const message = this.generateEmpatheticReminder(task, tone);
        
        // Send via multiple channels
        await this.sendPushNotification(user, message);
        if (user.preferences.emailReminders) {
            await this.sendEmail(user, message);
        }
    }
}
```

**Endpoints**:
```
POST /api/reminders/schedule
GET  /api/reminders
PUT  /api/reminders/:id
DELETE /api/reminders/:id
```

### 5. Mental Health Service

**Technology**: Node.js, PostgreSQL

**Responsibilities**:
- Track user emotional state
- Detect crisis signals
- Provide resource referrals
- Log mental health check-ins

**Crisis Detection**:
```javascript
class CrisisDetector {
    detectCrisis(message, userHistory) {
        const redFlags = [
            /self.?harm|suicide|kill myself/i,
            /want to die|end it all/i,
            /no point in living/i
        ];
        
        const hasRedFlag = redFlags.some(flag => flag.test(message));
        
        if (hasRedFlag) {
            return {
                isCrisis: true,
                severity: 'high',
                action: 'immediate_intervention'
            };
        }
        
        // Check for depression indicators
        const depressionSignals = this.analyzeDepressionSignals(userHistory);
        if (depressionSignals.score > 0.7) {
            return {
                isCrisis: true,
                severity: 'medium',
                action: 'resource_referral'
            };
        }
        
        return { isCrisis: false };
    }
}
```

**Endpoints**:
```
POST /api/mental-health/check-in
GET  /api/mental-health/insights
POST /api/mental-health/crisis-detection
```

## Data Flow Examples

### Flow 1: Syllabus Upload → Task Creation

```
1. User uploads PDF
   ↓
2. Frontend → API Gateway → AI Service
   ↓
3. AI Service:
   - OCR extracts text
   - LLM structures data
   - Returns JSON with tasks
   ↓
4. Task Service creates tasks in database
   ↓
5. Reminder Service schedules reminders
   ↓
6. Frontend displays new tasks
```

### Flow 2: Daily Schedule Generation

```
1. User requests schedule for tomorrow
   ↓
2. Task Service fetches pending tasks
   ↓
3. AI Service optimizes schedule:
   - Calculates priorities
   - Blocks time
   - Considers user preferences
   ↓
4. Schedule saved to database
   ↓
5. Reminder Service schedules reminders
   ↓
6. Frontend displays schedule
```

### Flow 3: Empathetic Chat Interaction

```
1. User sends message: "I'm so stressed"
   ↓
2. Chat Service receives message
   ↓
3. AI Service:
   - Analyzes sentiment
   - Detects emotion
   - Generates empathetic response
   ↓
4. Mental Health Service:
   - Logs interaction
   - Checks for crisis signals
   - Updates user emotional state
   ↓
5. Response sent to user
   ↓
6. If crisis detected → trigger intervention protocol
```

## Infrastructure

### Deployment Architecture

**Cloud Provider**: AWS (or Google Cloud/Azure)

**Services**:
- **Compute**: 
  - ECS/EKS (containerized services)
  - Lambda (serverless functions for lightweight tasks)
- **Database**:
  - RDS PostgreSQL (managed database)
  - DocumentDB (MongoDB-compatible for chat logs)
  - ElastiCache Redis (caching, queues)
- **Storage**:
  - S3 (file storage for PDFs, images)
- **AI/ML**:
  - SageMaker (optional, for custom models)
  - External APIs (OpenAI, Anthropic)
- **Monitoring**:
  - CloudWatch (logs, metrics)
  - X-Ray (distributed tracing)
  - Sentry (error tracking)

### CI/CD Pipeline

```
Git Push
  ↓
GitHub Actions / GitLab CI
  ↓
Run Tests (Unit + Integration)
  ↓
Build Docker Images
  ↓
Push to Container Registry (ECR)
  ↓
Deploy to Staging
  ↓
Run E2E Tests
  ↓
Deploy to Production (if tests pass)
```

### Security

**Authentication & Authorization**:
- JWT tokens with short expiration
- Refresh token rotation
- Role-based access control (RBAC)

**Data Protection**:
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- End-to-end encryption for sensitive chat data
- Regular security audits

**Compliance**:
- GDPR compliance (EU users)
- FERPA compliance (US student data)
- Regular privacy impact assessments

## Performance Considerations

### Optimization Strategies

1. **Caching**:
   - Redis cache for frequently accessed data
   - CDN for static assets
   - API response caching

2. **Database Optimization**:
   - Indexed queries
   - Connection pooling
   - Read replicas for scaling

3. **AI Cost Optimization**:
   - Cache common LLM responses
   - Batch API calls where possible
   - Use smaller models for simple tasks
   - Fine-tune models to reduce token usage

4. **Scalability**:
   - Horizontal scaling (multiple instances)
   - Load balancing
   - Auto-scaling based on traffic
   - Queue-based processing for heavy tasks

## Monitoring & Observability

### Key Metrics

**Application Metrics**:
- API response times
- Error rates
- Task completion rates
- Chat response quality scores

**Infrastructure Metrics**:
- CPU/Memory usage
- Database query performance
- Cache hit rates
- Queue processing times

**Business Metrics**:
- Daily Active Users (DAU)
- Task creation rate
- Chat interactions per user
- Premium conversion rate

### Logging

- Structured logging (JSON format)
- Log aggregation (CloudWatch, Datadog)
- Error tracking (Sentry)
- Audit logs for sensitive operations

## Development Environment Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose

### Local Development

```bash
# Clone repository
git clone https://github.com/zeni-app/zeni.git
cd zeni

# Install dependencies
npm install
pip install -r requirements.txt

# Start services with Docker Compose
docker-compose up -d

# Run migrations
npm run migrate

# Start development servers
npm run dev:api
npm run dev:ai-service
npm run dev:frontend
```

## Testing Strategy

### Unit Tests
- Service layer logic
- Utility functions
- AI prompt generation

### Integration Tests
- API endpoints
- Database operations
- External service integrations

### E2E Tests
- Critical user flows
- Syllabus upload → task creation
- Chat interactions
- Schedule generation

### AI Testing
- Response quality evaluation
- Emotion detection accuracy
- Task extraction precision
- Crisis detection sensitivity

## Future Technical Enhancements

1. **Edge Computing**: Deploy AI models closer to users for lower latency
2. **Offline Support**: Sync tasks and chat when offline
3. **Voice Interface**: Real-time voice conversations
4. **Multi-Modal AI**: Image understanding for handwritten notes
5. **Federated Learning**: Improve models without compromising privacy

