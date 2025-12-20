# ZENI - Feature Specifications

## Feature 1: Automatic Task Creation from Syllabus

### Overview
Users upload a syllabus PDF, and ZENI automatically extracts assignments, exams, and deadlines to create tasks.

### User Flow
1. User navigates to "Add Course" or "Upload Syllabus"
2. User uploads PDF (drag-and-drop or camera)
3. ZENI processes: "I'm reading your syllabus... almost done!"
4. ZENI displays extracted data: "I found 12 assignments and 3 exams. Want me to add them?"
5. User confirms or edits
6. Tasks appear in timeline

### Technical Implementation

#### Step 1: PDF Upload & OCR
```python
def upload_syllabus(file_path: str) -> str:
    """
    Upload PDF to S3, extract text using OCR
    Returns: Raw text from syllabus
    """
    # Upload to S3
    s3_key = upload_to_s3(file_path)
    
    # Extract text using OCR
    if file_path.endswith('.pdf'):
        text = extract_text_from_pdf(s3_key)
    else:
        text = tesseract_ocr(s3_key)
    
    return text
```

#### Step 2: AI Extraction
```python
def extract_course_data(text: str) -> dict:
    """
    Use LLM to extract structured data from syllabus text
    Returns: Structured course data
    """
    prompt = f"""
    Extract the following from this syllabus:
    
    1. Course Information:
       - Course name
       - Course code
       - Instructor name
       - Credits
    
    2. Assignments:
       - Assignment name/description
       - Due date
       - Weight/percentage
       - Requirements
    
    3. Exams:
       - Exam name (Midterm, Final, etc.)
       - Date
       - Time (if specified)
       - Weight/percentage
    
    4. Reading Schedule:
       - Week/date
       - Topics/chapters
    
    Return as JSON with this structure:
    {{
        "course": {{"name": "...", "code": "...", ...}},
        "assignments": [{{"name": "...", "due_date": "...", ...}}],
        "exams": [{{"name": "...", "date": "...", ...}}],
        "readings": [{{"week": "...", "topics": "..."}}]
    }}
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3  # Lower temperature for accuracy
    )
    
    return json.loads(response.choices[0].message.content)
```

#### Step 3: Task Creation
```python
def create_tasks_from_syllabus(course_data: dict, user_id: str):
    """
    Create tasks in database from extracted course data
    """
    course = create_course(course_data['course'], user_id)
    
    # Create assignment tasks
    for assignment in course_data['assignments']:
        task = Task(
            user_id=user_id,
            course_id=course.id,
            title=assignment['name'],
            description=assignment.get('requirements', ''),
            deadline=parse_date(assignment['due_date']),
            priority=calculate_initial_priority(assignment['due_date']),
            estimated_time=estimate_time(assignment),
            ai_generated=True
        )
        task.save()
        
        # Create subtasks if assignment is complex
        if is_complex_assignment(assignment):
            create_subtasks(task, assignment)
    
    # Create exam tasks with study blocks
    for exam in course_data['exams']:
        exam_task = Task(
            user_id=user_id,
            course_id=course.id,
            title=f"Study for {exam['name']}",
            deadline=parse_date(exam['date']),
            priority=10,  # Exams are high priority
            estimated_time=estimate_study_time(exam),
            ai_generated=True
        )
        exam_task.save()
        
        # Create study schedule (break into daily study blocks)
        create_study_schedule(exam_task, exam['date'])
```

#### Step 4: Priority Calculation
```python
def calculate_initial_priority(due_date: str) -> int:
    """
    Calculate initial priority based on deadline proximity
    Returns: Priority score 1-10
    """
    days_until_due = (parse_date(due_date) - datetime.now()).days
    
    if days_until_due < 3:
        return 10  # Urgent
    elif days_until_due < 7:
        return 8   # High
    elif days_until_due < 14:
        return 6   # Medium
    elif days_until_due < 30:
        return 4   # Low
    else:
        return 2   # Very low
```

### Error Handling
- **OCR fails**: "I had trouble reading your syllabus. Can you try a clearer image?"
- **No data extracted**: "I couldn't find assignments in your syllabus. Want to add them manually?"
- **Partial extraction**: "I found some assignments, but some dates were unclear. Want to review them?"

### Success Metrics
- Extraction accuracy: >90%
- User satisfaction with auto-created tasks: >4.0/5.0
- Time saved vs manual entry: >80%

---

## Feature 2: AI-Generated Daily Schedules

### Overview
ZENI automatically generates optimized daily schedules based on tasks, deadlines, user preferences, and energy levels.

### User Flow
1. User opens app in morning (or requests schedule)
2. ZENI displays: "Here's your schedule for today. How does it look?"
3. User can accept, modify, or request changes
4. Schedule updates throughout day as tasks are completed/missed

### Technical Implementation

#### Step 1: Gather Context
```python
def generate_daily_schedule(user_id: str, date: datetime) -> Schedule:
    """
    Generate optimized schedule for a specific day
    """
    # Get user preferences
    user_prefs = get_user_preferences(user_id)
    
    # Get pending tasks
    tasks = get_pending_tasks(user_id, date)
    
    # Get fixed commitments (classes, meetings)
    fixed_commitments = get_fixed_commitments(user_id, date)
    
    # Get user's energy patterns
    energy_patterns = get_energy_patterns(user_id)
    
    # Calculate priorities
    prioritized_tasks = prioritize_tasks(tasks, user_prefs)
    
    # Generate time blocks
    schedule = create_time_blocks(
        tasks=prioritized_tasks,
        fixed_commitments=fixed_commitments,
        available_hours=calculate_available_hours(date, fixed_commitments),
        energy_patterns=energy_patterns,
        user_prefs=user_prefs
    )
    
    return schedule
```

#### Step 2: Task Prioritization
```python
def prioritize_tasks(tasks: List[Task], user_prefs: dict) -> List[Task]:
    """
    Calculate priority scores for tasks
    """
    for task in tasks:
        # Urgency score (0-10)
        urgency = calculate_urgency(task.deadline)
        
        # Stress score (0-10) - based on user's reported stress or inferred
        stress = user_prefs.get('current_stress_level', 5)
        
        # Task complexity (0-10)
        complexity = estimate_complexity(task)
        
        # Combined priority score
        task.priority_score = (
            urgency * 0.4 +
            stress * 0.3 +
            complexity * 0.3
        )
    
    return sorted(tasks, key=lambda t: t.priority_score, reverse=True)
```

#### Step 3: Time Blocking Algorithm
```python
def create_time_blocks(
    tasks: List[Task],
    fixed_commitments: List[Commitment],
    available_hours: List[TimeSlot],
    energy_patterns: dict,
    user_prefs: dict
) -> Schedule:
    """
    Create optimized time blocks for the day
    """
    schedule = Schedule(date=date)
    
    # Add fixed commitments first
    for commitment in fixed_commitments:
        schedule.add_block(commitment)
    
    # Sort available time slots by energy level
    available_slots = sort_by_energy(available_hours, energy_patterns)
    
    # Allocate tasks to time slots
    for task in tasks:
        # Find best time slot for this task
        best_slot = find_best_slot(
            task=task,
            available_slots=available_slots,
            energy_patterns=energy_patterns
        )
        
        if best_slot:
            # Create time block
            block = TimeBlock(
                task=task,
                start_time=best_slot.start,
                end_time=best_slot.start + task.estimated_time,
                buffer_time=calculate_buffer(task)
            )
            schedule.add_block(block)
            
            # Update available slots
            available_slots = update_available_slots(available_slots, block)
        else:
            # No time available - mark for rescheduling
            schedule.add_unallocated_task(task)
    
    # Add breaks
    schedule = add_breaks(schedule, user_prefs)
    
    return schedule
```

#### Step 4: Energy-Aware Scheduling
```python
def find_best_slot(
    task: Task,
    available_slots: List[TimeSlot],
    energy_patterns: dict
) -> TimeSlot:
    """
    Find best time slot for task based on energy levels
    """
    # High-focus tasks need high-energy slots
    if task.requires_focus:
        high_energy_slots = [s for s in available_slots if s.energy_level > 7]
        if high_energy_slots:
            return high_energy_slots[0]
    
    # Medium-focus tasks can use medium-energy slots
    elif task.requires_moderate_focus:
        medium_energy_slots = [s for s in available_slots if 4 < s.energy_level <= 7]
        if medium_energy_slots:
            return medium_energy_slots[0]
    
    # Low-focus tasks can use any slot
    return available_slots[0] if available_slots else None
```

### Example Schedule Output
```json
{
  "date": "2024-10-15",
  "blocks": [
    {
      "type": "task",
      "task_id": "123",
      "title": "Math Homework",
      "start_time": "08:00",
      "end_time": "09:30",
      "priority": "high",
      "energy_required": "high"
    },
    {
      "type": "break",
      "title": "Break",
      "start_time": "09:30",
      "end_time": "09:45"
    },
    {
      "type": "commitment",
      "title": "Organic Chemistry Class",
      "start_time": "10:00",
      "end_time": "11:30",
      "location": "Room 201"
    }
  ],
  "unallocated_tasks": []
}
```

### Success Metrics
- Schedule adherence: >60%
- User satisfaction: >4.0/5.0
- Time saved vs manual planning: >70%

---

## Feature 3: Empathetic Chatbot

### Overview
ZENI provides emotional support through empathetic conversations, recognizing distress and responding with warmth.

### User Flow
1. User opens chat: "I'm so stressed"
2. ZENI analyzes message (sentiment, emotion, context)
3. ZENI generates empathetic response
4. Conversation continues naturally
5. If crisis detected, trigger intervention protocol

### Technical Implementation

#### Step 1: Message Analysis
```python
def analyze_user_message(message: str, user_context: dict) -> dict:
    """
    Analyze user message for sentiment, emotion, and intent
    """
    # Sentiment analysis
    sentiment = analyze_sentiment(message)  # positive, neutral, negative
    
    # Emotion detection
    emotions = detect_emotions(message)  # stress, anxiety, burnout, etc.
    
    # Intent classification
    intent = classify_intent(message)  # support_request, task_help, crisis, etc.
    
    # Crisis detection
    crisis_signals = detect_crisis_signals(message)
    
    return {
        "sentiment": sentiment,
        "emotions": emotions,
        "intent": intent,
        "crisis_detected": crisis_signals['is_crisis'],
        "severity": crisis_signals.get('severity', 'low')
    }
```

#### Step 2: Response Generation
```python
def generate_empathetic_response(
    user_message: str,
    analysis: dict,
    user_context: dict,
    conversation_history: List[dict]
) -> str:
    """
    Generate empathetic, human-like response
    """
    # Build context-aware prompt
    prompt = f"""
    You are ZENI, an empathetic AI student companion. Your role is to:
    - Provide emotional support and validation
    - Help students feel understood, not judged
    - Offer practical help when appropriate
    - Act like a caring friend, NOT a therapist
    
    User Context:
    - Current stress level: {user_context.get('stress_level', 'unknown')}
    - Recent task completion: {user_context.get('recent_completion_rate', 'unknown')}
    - Time of day: {datetime.now().strftime('%H:%M')}
    
    User Message: "{user_message}"
    
    Detected Emotions: {', '.join(analysis['emotions'])}
    Sentiment: {analysis['sentiment']}
    
    Conversation History:
    {format_conversation_history(conversation_history[-5:])}
    
    Guidelines:
    1. Acknowledge and validate their feelings
    2. Use warm, conversational language (not robotic)
    3. Offer specific, actionable help if appropriate
    4. Don't dismiss or minimize their feelings
    5. Don't give clinical advice (you're not a therapist)
    6. Keep response under 150 words
    
    Generate your response:
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are ZENI, an empathetic AI student companion."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7  # Higher temperature for more natural, varied responses
    )
    
    return response.choices[0].message.content
```

#### Step 3: Crisis Detection
```python
def detect_crisis_signals(message: str) -> dict:
    """
    Detect crisis signals in user message
    """
    red_flags = [
        (r'self.?harm|suicide|kill myself|end it all', 'high'),
        (r'want to die|no point living|better off dead', 'high'),
        (r'cutting|hurting myself', 'high'),
        (r'hopeless|nothing matters|give up', 'medium'),
        (r'can\'t go on|can\'t handle this anymore', 'medium')
    ]
    
    for pattern, severity in red_flags:
        if re.search(pattern, message, re.IGNORECASE):
            return {
                'is_crisis': True,
                'severity': severity,
                'action': 'immediate_intervention' if severity == 'high' else 'resource_referral'
            }
    
    return {'is_crisis': False, 'severity': 'low'}
```

#### Step 4: Crisis Response
```python
def handle_crisis(user_id: str, severity: str) -> dict:
    """
    Handle crisis situation with appropriate response
    """
    if severity == 'high':
        response = {
            "message": "I'm concerned about you. Your safety is important. Here are resources that can help:\n\n" +
                      "Crisis Text Line: Text HOME to 741741\n" +
                      "National Suicide Prevention Lifeline: 988\n" +
                      "Your campus counseling center: [link]\n\n" +
                      "Please reach out to someone you trust or a professional. You don't have to go through this alone.",
            "show_resources": True,
            "suggest_contact": True
        }
        
        # Log crisis for follow-up
        log_crisis_event(user_id, severity)
        
        # Notify support team (if applicable)
        if has_support_team():
            notify_support_team(user_id, severity)
    
    else:
        response = {
            "message": "I hear you're going through a tough time. It's okay to feel this way. " +
                      "Would you like me to help you find some resources or support?",
            "show_resources": True,
            "suggest_contact": False
        }
    
    return response
```

### Example Conversations

**Example 1: Stress Support**
```
User: "I'm so stressed about exams. I feel like I'm going to fail everything."

ZENI: "I hear you, and exam stress is really tough. Feeling overwhelmed doesn't mean you're going to fail—it means you care, and that's actually a strength. 

Want to break down your study plan together? Sometimes looking at everything at once feels impossible, but taking it step by step can help. You've got this, and I'm here to help you figure it out."
```

**Example 2: Procrastination**
```
User: "I keep putting off my essay. I know I should start but I just can't."

ZENI: "Procrastination often happens when tasks feel too big or overwhelming. That's totally normal, and you're not alone in this.

What if we break your essay into tiny steps? Even writing just one paragraph is progress. Want to try that? Sometimes starting is the hardest part, but once you begin, it gets easier."
```

**Example 3: Burnout**
```
User: "I'm so burned out. I can't keep up with everything."

ZENI: "Burnout is real, and it's not your fault. You've been pushing yourself hard, and your body and mind are telling you to slow down. That's important to listen to.

Let's look at your schedule and see where we can create some breathing room. Rest isn't laziness—it's necessary. How can I help you find some balance?"
```

### Success Metrics
- User satisfaction with chat: >4.5/5.0
- Crisis detection accuracy: >95%
- Users report feeling "understood": >80%
- Chat engagement: >3 conversations per user per week

---

## Feature 4: Context-Aware Reminders

### Overview
ZENI sends intelligent, empathetic reminders that adapt to user mood, schedule, and behavior patterns.

### User Flow
1. Task deadline approaching
2. ZENI calculates optimal reminder time
3. ZENI generates reminder with appropriate tone
4. Reminder sent via push notification (and optionally email/SMS)
5. User interacts (completes task, snoozes, or dismisses)

### Technical Implementation

#### Step 1: Reminder Scheduling
```python
def schedule_reminder(task: Task, user: User):
    """
    Schedule reminder for task based on optimal timing
    """
    # Calculate optimal reminder time
    reminder_time = calculate_optimal_reminder_time(task, user)
    
    # Determine reminder tone
    tone = determine_reminder_tone(user, task)
    
    # Schedule reminder job
    reminder_job = {
        'task_id': task.id,
        'user_id': user.id,
        'reminder_time': reminder_time,
        'tone': tone,
        'channels': user.preferences.get('reminder_channels', ['push'])
    }
    
    # Add to queue
    queue.add('send-reminder', reminder_job, delay=reminder_time - datetime.now())
```

#### Step 2: Optimal Timing Calculation
```python
def calculate_optimal_reminder_time(task: Task, user: User) -> datetime:
    """
    Calculate when to send reminder based on:
    - Task deadline
    - Task complexity
    - User's typical completion patterns
    - User's current schedule
    """
    deadline = task.deadline
    now = datetime.now()
    time_until_deadline = (deadline - now).total_seconds() / 3600  # hours
    
    # If deadline is very soon (< 6 hours), remind immediately
    if time_until_deadline < 6:
        return now + timedelta(minutes=5)
    
    # If deadline is today, remind 2-3 hours before
    elif time_until_deadline < 24:
        return deadline - timedelta(hours=2)
    
    # If deadline is this week, remind 1 day before
    elif time_until_deadline < 168:  # 7 days
        return deadline - timedelta(days=1)
    
    # If deadline is further out, remind 3 days before
    else:
        return deadline - timedelta(days=3)
```

#### Step 3: Tone Determination
```python
def determine_reminder_tone(user: User, task: Task) -> str:
    """
    Determine reminder tone based on user's emotional state and task urgency
    """
    # Get user's current stress level
    stress_level = user.current_stress_level or 5  # 1-10
    
    # Get task urgency
    urgency = calculate_urgency(task.deadline)
    
    # Determine tone
    if stress_level > 7:
        return 'supportive'  # "I know you're stressed, but you've got this"
    elif urgency > 8:
        return 'gentle_urgent'  # "This is important, but I believe in you"
    elif user.recent_completion_rate < 0.5:
        return 'encouraging'  # "You've got this! Want to break it down?"
    else:
        return 'friendly'  # "Hey! Just a reminder about [task]"
```

#### Step 4: Reminder Generation
```python
def generate_reminder_message(task: Task, tone: str, user: User) -> str:
    """
    Generate empathetic reminder message
    """
    templates = {
        'supportive': [
            "Hey {name}, I know you're feeling {emotion}, but you've got this. {task} is due {time}. Want to break it down together?",
            "I see {task} is coming up. I know things feel overwhelming right now, but you're capable. Want some help?"
        ],
        'gentle_urgent': [
            "Hey! {task} is due {time}. I know this is important—want me to help you prioritize?",
            "Just a heads up: {task} deadline is {time}. You've got this! 🎯"
        ],
        'encouraging': [
            "You've been doing great! {task} is due {time}. Want to tackle it together?",
            "Hey {name}! {task} is coming up. I believe in you—let's do this! 💪"
        ],
        'friendly': [
            "Hey! Just a friendly reminder: {task} is due {time}. You've got this! 😊",
            "Hi {name}! {task} deadline is {time}. Want me to help you plan?"
        ]
    }
    
    # Select template based on tone
    template = random.choice(templates[tone])
    
    # Fill in variables
    message = template.format(
        name=user.first_name or "there",
        task=task.title,
        time=format_time_until_deadline(task.deadline),
        emotion=infer_emotion(user) or "stressed"
    )
    
    return message
```

### Success Metrics
- Reminder effectiveness (task completed after reminder): >40%
- User satisfaction with reminders: >4.0/5.0
- Reminder frequency (not too spammy): <3 per day average
- Tone appropriateness: >85% user approval

---

## Feature 5: Auto-Adjusting Schedules

### Overview
When users miss tasks, ZENI automatically reschedules them without judgment, adapting to user's reality.

### User Flow
1. User misses scheduled task
2. ZENI detects: "I noticed you didn't get to [task] today. That's okay!"
3. ZENI automatically reschedules to next available slot
4. If deadline approaching, ZENI suggests breaking task into smaller steps
5. User can accept, modify, or request different time

### Technical Implementation

#### Step 1: Missed Task Detection
```python
def detect_missed_tasks(user_id: str, date: datetime):
    """
    Detect tasks that were scheduled but not completed
    """
    scheduled_tasks = get_scheduled_tasks(user_id, date)
    completed_tasks = get_completed_tasks(user_id, date)
    
    missed_tasks = [
        task for task in scheduled_tasks
        if task.id not in [t.id for t in completed_tasks]
        and task.deadline > datetime.now()  # Only if not past deadline
    ]
    
    return missed_tasks
```

#### Step 2: Automatic Rescheduling
```python
def reschedule_missed_task(task: Task, user: User) -> dict:
    """
    Automatically reschedule missed task
    """
    # Calculate new priority
    new_priority = recalculate_priority(task)
    
    # Find next available slot
    next_slot = find_next_available_slot(user, task)
    
    if next_slot:
        # Reschedule
        update_task_schedule(task, next_slot)
        
        # Generate empathetic message
        message = generate_reschedule_message(task, user, next_slot)
        
        return {
            'success': True,
            'message': message,
            'new_schedule': next_slot
        }
    else:
        # No available slot - suggest breaking down
        return {
            'success': False,
            'message': generate_breakdown_suggestion(task, user),
            'suggest_breakdown': True
        }
```

#### Step 3: Priority Recalculation
```python
def recalculate_priority(task: Task) -> int:
    """
    Recalculate priority when task is missed
    """
    days_until_deadline = (task.deadline - datetime.now()).days
    
    # Increase priority if deadline is approaching
    if days_until_deadline < 2:
        return min(10, task.priority + 2)  # Boost priority
    elif days_until_deadline < 7:
        return min(10, task.priority + 1)  # Slight boost
    else:
        return task.priority  # Keep same priority
```

#### Step 4: Message Generation
```python
def generate_reschedule_message(task: Task, user: User, new_slot: TimeSlot) -> str:
    """
    Generate empathetic rescheduling message
    """
    messages = [
        f"I noticed you didn't get to '{task.title}' today. That's okay! I've moved it to {format_time(new_slot.start_time)}. You've got this! 💪",
        f"No worries about '{task.title}'—I've rescheduled it for {format_time(new_slot.start_time)}. Want to break it down into smaller steps?",
        f"Hey, I moved '{task.title}' to {format_time(new_slot.start_time)}. Sometimes things don't go as planned, and that's totally normal. You're doing great!"
    ]
    
    return random.choice(messages)
```

### Success Metrics
- Rescheduling acceptance rate: >70%
- User satisfaction with auto-adjustment: >4.0/5.0
- Reduction in user stress from missed tasks: >30%

---

## Feature 6: Zero-Setup Onboarding

### Overview
Users can start using ZENI immediately with minimal questions, no templates, no complex setup.

### User Flow
1. User opens app for first time
2. Warm welcome: "Hi! I'm ZENI. No setup needed—just tell me about yourself."
3. Conversational questions (5-7)
4. Optional syllabus upload
5. Immediate value: tasks organized, ready to use

### Technical Implementation

#### Onboarding Questions
```python
ONBOARDING_QUESTIONS = [
    {
        'id': 'name',
        'question': "What's your name?",
        'type': 'text',
        'required': True
    },
    {
        'id': 'field_of_study',
        'question': "What are you studying?",
        'type': 'text',
        'required': True
    },
    {
        'id': 'num_classes',
        'question': "How many classes are you taking this semester?",
        'type': 'number',
        'required': True
    },
    {
        'id': 'extracurriculars',
        'question': "Do you have any clubs or activities outside of classes?",
        'type': 'text',
        'required': False
    },
    {
        'id': 'wake_time',
        'question': "What time do you usually wake up?",
        'type': 'time',
        'required': False
    },
    {
        'id': 'energy_pattern',
        'question': "Are you a morning person or night owl?",
        'type': 'choice',
        'options': ['Morning person', 'Night owl', 'Neither'],
        'required': False
    },
    {
        'id': 'biggest_stress',
        'question': "What stresses you out the most about school?",
        'type': 'text',
        'required': False
    }
]
```

#### Conversational Flow
```python
def handle_onboarding(user_id: str, current_step: int, answer: str):
    """
    Handle onboarding conversation flow
    """
    question = ONBOARDING_QUESTIONS[current_step]
    
    # Save answer
    save_onboarding_answer(user_id, question['id'], answer)
    
    # Check if complete
    if current_step >= len(ONBOARDING_QUESTIONS) - 1:
        # Complete onboarding
        complete_onboarding(user_id)
        return {
            'complete': True,
            'message': "You're all set! Want to upload your syllabus? I'll organize everything for you."
        }
    else:
        # Next question
        next_question = ONBOARDING_QUESTIONS[current_step + 1]
        return {
            'complete': False,
            'next_question': next_question['question'],
            'step': current_step + 1
        }
```

### Success Metrics
- Onboarding completion rate: >80%
- Time to complete: <5 minutes
- User satisfaction: >4.5/5.0
- Immediate value perception: >90%

---

## Feature 7: Learning System

### Overview
ZENI learns from user behavior over time to improve scheduling, reminders, and support.

### What ZENI Learns

1. **Productivity Patterns**
   - When user is most productive
   - How long tasks actually take (vs estimated)
   - Which task types user completes vs procrastinates

2. **Communication Preferences**
   - Preferred reminder frequency
   - Preferred communication style
   - Best times to send reminders

3. **Emotional Patterns**
   - Stress triggers
   - What helps user feel better
   - Emotional state patterns (weekly, monthly)

### Technical Implementation

#### Learning from Task Completion
```python
def learn_from_task_completion(task: Task, actual_time: int):
    """
    Learn from completed tasks to improve future estimates
    """
    # Update time estimates
    if task.estimated_time:
        error = actual_time - task.estimated_time
        update_time_estimate_model(
            task_type=task.type,
            error=error,
            user_id=task.user_id
        )
    
    # Update productivity patterns
    completion_time = task.completed_at
    update_productivity_pattern(
        user_id=task.user_id,
        hour=completion_time.hour,
        day_of_week=completion_time.weekday(),
        task_type=task.type
    )
```

#### Adapting Reminder Frequency
```python
def adapt_reminder_frequency(user_id: str):
    """
    Adapt reminder frequency based on user behavior
    """
    user = get_user(user_id)
    completion_rate = calculate_completion_rate(user_id, days=30)
    
    if completion_rate > 0.8:
        # User is reliable, reduce reminders
        user.preferences['reminder_frequency'] = 'low'
    elif completion_rate < 0.5:
        # User needs more support, increase reminders
        user.preferences['reminder_frequency'] = 'high'
    else:
        # Keep current frequency
        pass
    
    user.save()
```

### Success Metrics
- Improvement in time estimates: >20% accuracy improvement over 3 months
- User satisfaction with learned preferences: >4.0/5.0
- Reduction in reminder frequency (for reliable users): >30%

