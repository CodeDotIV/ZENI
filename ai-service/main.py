from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
from dotenv import load_dotenv
import openai
import re

load_dotenv()

app = FastAPI(title="ZENI AI Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Models
class ChatRequest(BaseModel):
    message: str
    user_context: Dict
    conversation_history: List[Dict] = []

class ChatResponse(BaseModel):
    response: str
    sentiment: str
    emotions: List[str]
    crisis_detected: bool
    crisis_severity: str = "low"

class SyllabusParseRequest(BaseModel):
    text: str

class SyllabusParseResponse(BaseModel):
    course: Dict
    assignments: List[Dict]
    exams: List[Dict]
    readings: List[Dict] = []

# Crisis detection patterns
CRISIS_PATTERNS = [
    (r'self.?harm|suicide|kill myself|end it all', 'high'),
    (r'want to die|no point living|better off dead', 'high'),
    (r'cutting|hurting myself', 'high'),
    (r'hopeless|nothing matters|give up', 'medium'),
    (r"can't go on|can't handle this anymore", 'medium')
]

def detect_crisis(message: str) -> Dict:
    """Detect crisis signals in user message"""
    message_lower = message.lower()
    
    for pattern, severity in CRISIS_PATTERNS:
        if re.search(pattern, message_lower):
            return {
                'is_crisis': True,
                'severity': severity,
                'action': 'immediate_intervention' if severity == 'high' else 'resource_referral'
            }
    
    return {'is_crisis': False, 'severity': 'low'}

def analyze_sentiment(message: str) -> str:
    """Simple sentiment analysis"""
    negative_words = ['stress', 'stressed', 'overwhelmed', 'anxious', 'worried', 'sad', 'depressed', 'burnout']
    positive_words = ['good', 'great', 'happy', 'excited', 'confident', 'ready']
    
    message_lower = message.lower()
    negative_count = sum(1 for word in negative_words if word in message_lower)
    positive_count = sum(1 for word in positive_words if word in message_lower)
    
    if negative_count > positive_count:
        return 'negative'
    elif positive_count > negative_count:
        return 'positive'
    return 'neutral'

def detect_emotions(message: str) -> List[str]:
    """Detect emotions in message"""
    emotions = []
    emotion_keywords = {
        'stress': ['stress', 'stressed', 'stressing'],
        'anxiety': ['anxious', 'anxiety', 'worried', 'worry'],
        'burnout': ['burnout', 'burned out', 'exhausted'],
        'overwhelm': ['overwhelmed', 'too much', 'can\'t handle'],
        'sadness': ['sad', 'depressed', 'down', 'low'],
        'frustration': ['frustrated', 'frustrating', 'annoyed']
    }
    
    message_lower = message.lower()
    for emotion, keywords in emotion_keywords.items():
        if any(keyword in message_lower for keyword in keywords):
            emotions.append(emotion)
    
    return emotions if emotions else ['neutral']

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Generate empathetic chat response"""
    
    # Detect crisis
    crisis_info = detect_crisis(request.message)
    
    # Analyze sentiment and emotions
    sentiment = analyze_sentiment(request.message)
    emotions = detect_emotions(request.message)
    
    # Build conversation context
    context = f"""
    User Context:
    - Name: {request.user_context.get('first_name', 'there')}
    - Field of Study: {request.user_context.get('field_of_study', 'student')}
    
    User Message: "{request.message}"
    
    Detected Emotions: {', '.join(emotions)}
    Sentiment: {sentiment}
    """
    
    # Build system prompt
    system_prompt = """You are ZENI, an empathetic AI student companion. Your role is to:
- Provide emotional support and validation
- Help students feel understood, not judged
- Offer practical help when appropriate
- Act like a caring friend, NOT a therapist
- Use warm, conversational language (not robotic)
- Keep responses under 150 words
- Acknowledge and validate their feelings
- Don't dismiss or minimize their feelings
- Don't give clinical advice"""
    
    # If crisis detected, adjust response
    if crisis_info['is_crisis']:
        system_prompt += "\n\nIMPORTANT: Crisis detected. Provide immediate support and resources."
    
    try:
        # Use OpenAI for response generation
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": context + "\n\nGenerate your empathetic response:"}
            ],
            temperature=0.7,
            max_tokens=200
        )
        
        ai_response = response.choices[0].message.content
        
        # If crisis, append resources
        if crisis_info['is_crisis']:
            ai_response += "\n\nI'm concerned about you. Your safety is important. Here are resources:\n- Crisis Text Line: Text HOME to 741741\n- National Suicide Prevention Lifeline: 988"
        
        return ChatResponse(
            response=ai_response,
            sentiment=sentiment,
            emotions=emotions,
            crisis_detected=crisis_info['is_crisis'],
            crisis_severity=crisis_info['severity']
        )
    
    except Exception as e:
        # Fallback response
        return ChatResponse(
            response="I'm here to help! Can you tell me more about what's on your mind?",
            sentiment=sentiment,
            emotions=emotions,
            crisis_detected=crisis_info['is_crisis'],
            crisis_severity=crisis_info['severity']
        )

@app.post("/api/parse-syllabus", response_model=SyllabusParseResponse)
async def parse_syllabus(request: SyllabusParseRequest):
    """Extract structured data from syllabus text"""
    
    prompt = f"""
    Extract the following from this syllabus:
    
    1. Course Information:
       - Course name
       - Course code
       - Instructor name
       - Credits
    
    2. Assignments:
       - Assignment name/description
       - Due date (format as YYYY-MM-DD)
       - Weight/percentage (if mentioned)
       - Requirements
    
    3. Exams:
       - Exam name (Midterm, Final, etc.)
       - Date (format as YYYY-MM-DD)
       - Time (if specified)
       - Weight/percentage (if mentioned)
    
    4. Reading Schedule:
       - Week/date
       - Topics/chapters
    
    Return as JSON with this structure:
    {{
        "course": {{"name": "...", "code": "...", "instructor": "...", "credits": ...}},
        "assignments": [{{"name": "...", "due_date": "...", "weight": "...", "requirements": "..."}}],
        "exams": [{{"name": "...", "date": "...", "time": "...", "weight": "..."}}],
        "readings": [{{"week": "...", "topics": "..."}}]
    }}
    
    Syllabus text:
    {request.text}
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that extracts structured data from academic syllabi. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        import json
        extracted_data = json.loads(response.choices[0].message.content)
        
        return SyllabusParseResponse(
            course=extracted_data.get('course', {}),
            assignments=extracted_data.get('assignments', []),
            exams=extracted_data.get('exams', []),
            readings=extracted_data.get('readings', [])
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing syllabus: {str(e)}")

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "service": "ZENI AI Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

