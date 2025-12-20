'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const QUESTION_CATEGORIES = {
  stress: {
    title: "😰 Stress & Anxiety",
    color: "from-red-500 to-orange-500",
    questions: [
      "How can I manage my stress better?",
      "I'm feeling overwhelmed with assignments",
      "I feel anxious about upcoming exams",
      "How do I deal with exam anxiety?",
      "I feel stressed about my future",
      "How can I reduce my anxiety?",
      "I feel like I have too much on my plate",
      "What should I do when I feel burned out?"
    ]
  },
  motivation: {
    title: "💪 Motivation & Productivity",
    color: "from-blue-500 to-cyan-500",
    questions: [
      "I'm struggling with motivation",
      "I'm procrastinating and can't get started",
      "How can I be more productive?",
      "I feel unmotivated to do my homework",
      "How do I stay focused while studying?",
      "I'm having trouble concentrating",
      "I need tips for better time management",
      "I'm struggling with time management"
    ]
  },
  academic: {
    title: "📚 Academic & Study",
    color: "from-purple-500 to-indigo-500",
    questions: [
      "Help me organize my study schedule",
      "Can you help me break down a big project?",
      "I feel like I'm falling behind in my classes",
      "How can I improve my study habits?",
      "I'm worried about my grades",
      "What are some good study techniques?",
      "How do I handle multiple deadlines?",
      "I don't know how to prioritize my tasks"
    ]
  },
  wellbeing: {
    title: "❤️ Well-being & Balance",
    color: "from-pink-500 to-rose-500",
    questions: [
      "I'm having trouble sleeping",
      "How do I balance school and personal life?",
      "I'm feeling lonely and need someone to talk to",
      "I need help creating a daily routine",
      "I need help staying organized",
      "I'm having trouble with work-life balance"
    ]
  }
}

export default function Chat() {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [askedQuestions, setAskedQuestions] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    checkAuth()
    // Always start with a fresh chat - don't load history
    setMessages([])
    setShowWelcome(true)
    setAskedQuestions([])
    
    // Cleanup: Clear messages when component unmounts
    return () => {
      setMessages([])
      setShowWelcome(true)
      setAskedQuestions([])
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Removed saveMessage - we don't persist chat history anymore

  const generateResponse = (userMessage) => {
    // Simple mock responses based on keywords
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('overwhelmed')) {
      return "I understand you're feeling stressed. That's completely normal, especially during school. Take a deep breath. What specifically is making you feel this way? I'm here to listen. Remember, it's okay to take breaks and prioritize your mental health."
    }
    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('sleep')) {
      return "It sounds like you're feeling tired. Rest is important for your well-being. Have you been getting enough sleep? Remember, taking care of yourself is just as important as your studies. Try to maintain a regular sleep schedule."
    }
    if (lowerMessage.includes('homework') || lowerMessage.includes('assignment') || lowerMessage.includes('deadline') || lowerMessage.includes('project')) {
      return "I can help you organize your assignments! Would you like me to help you break down your tasks into smaller, manageable steps? Sometimes it helps to tackle one thing at a time. Start with the most urgent task and work your way through."
    }
    if (lowerMessage.includes('schedule') || lowerMessage.includes('time management') || lowerMessage.includes('organize')) {
      return "Great question! Time management is key to success. Try using the Pomodoro Technique: work for 25 minutes, then take a 5-minute break. Also, prioritize your tasks by urgency and importance. I can help you create a personalized schedule!"
    }
    if (lowerMessage.includes('motivation') || lowerMessage.includes('struggling')) {
      return "I hear you. Motivation can be tough sometimes. Remember why you started - your goals matter. Break things into small wins and celebrate each accomplishment. You're capable of more than you think!"
    }
    if (lowerMessage.includes('lonely') || lowerMessage.includes('talk')) {
      return "I'm here for you. Feeling lonely is valid, and it's okay to reach out. You're not alone in this. Would you like to talk about what's on your mind? Sometimes just expressing our feelings can help."
    }
    if (lowerMessage.includes('balance') || lowerMessage.includes('personal life')) {
      return "Balance is so important! Remember that you're a person first, student second. Schedule time for things you enjoy, spend time with friends, and don't forget to rest. A balanced life leads to better academic performance too."
    }
    if (lowerMessage.includes('exam') || lowerMessage.includes('test')) {
      return "Exam anxiety is real and understandable. Preparation is key - create a study plan, review regularly, and practice. On exam day, breathe deeply and remember you've prepared for this. You've got this!"
    }
    
    // Default empathetic response
    return "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about what's on your mind? Remember, it's okay to not be okay sometimes. We'll work through this together."
  }

  const handleQuestionClick = (question) => {
    setShowWelcome(false)
    // Track that this question has been asked
    setAskedQuestions(prev => [...prev, question])
    handleSendMessage(question)
  }

  // Get all questions from all categories
  const getAllQuestions = () => {
    return Object.values(QUESTION_CATEGORIES).flatMap(category => category.questions)
  }

  // Get remaining questions that haven't been asked
  const getRemainingQuestions = () => {
    const allQuestions = getAllQuestions()
    return allQuestions.filter(q => !askedQuestions.includes(q))
  }

  // Get remaining questions by category
  const getRemainingQuestionsByCategory = (categoryKey) => {
    const category = QUESTION_CATEGORIES[categoryKey]
    return category.questions.filter(q => !askedQuestions.includes(q))
  }

  const handleSendMessage = (messageText) => {
    if (!messageText.trim() || loading) return

    setLoading(true)

    // Add user message immediately
    const tempUserMessage = {
      id: Date.now(),
      message: messageText,
      response: null,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(messageText)
      const updatedMessage = {
        ...tempUserMessage,
        response: response,
        sentiment: 'neutral'
      }
      
      setMessages(prev => prev.map(msg =>
        msg.id === tempUserMessage.id ? updatedMessage : msg
      ))
      setLoading(false)
    }, 1000)
  }

  // Removed handleSend - users can only interact through predefined questions

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-rose-500 to-orange-500 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">❤️</span>
            <h1 className="text-2xl font-bold text-primary-600">Chat with ZENI</h1>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto container mx-auto px-4 py-6 max-w-4xl">
        {showWelcome && messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mx-auto mb-4 animate-bounce">❤️</div>
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              Hi {user?.first_name ? user.first_name : 'there'}! I'm ZENI 👋
            </h2>
            <p className="text-white/90 drop-shadow-md mb-6 text-lg">
              I'm here to listen and support you. How can I help you today?
            </p>
            
            {/* Predefined Questions by Mood */}
            <div className="mt-8 space-y-6 max-w-5xl mx-auto">
              <p className="text-white/90 text-base mb-6 font-semibold text-center">Choose a question based on how you're feeling:</p>
              
              {/* Stress & Anxiety Row */}
              <div>
                <h3 className="text-white font-bold mb-3 text-xl drop-shadow-lg bg-gradient-to-r from-red-400 to-orange-400 px-4 py-2 rounded-lg inline-block">
                  {QUESTION_CATEGORIES.stress.title}
                </h3>
                <div className="grid md:grid-cols-4 gap-3">
                  {QUESTION_CATEGORIES.stress.questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm hover:from-red-500/30 hover:to-orange-500/30 border border-red-300/30 rounded-lg px-4 py-3 text-left text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motivation & Productivity Row */}
              <div>
                <h3 className="text-white font-bold mb-3 text-xl drop-shadow-lg bg-gradient-to-r from-blue-400 to-cyan-400 px-4 py-2 rounded-lg inline-block">
                  {QUESTION_CATEGORIES.motivation.title}
                </h3>
                <div className="grid md:grid-cols-4 gap-3">
                  {QUESTION_CATEGORIES.motivation.questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-300/30 rounded-lg px-4 py-3 text-left text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Academic & Study Row */}
              <div>
                <h3 className="text-white font-bold mb-3 text-xl drop-shadow-lg bg-gradient-to-r from-purple-400 to-indigo-400 px-4 py-2 rounded-lg inline-block">
                  {QUESTION_CATEGORIES.academic.title}
                </h3>
                <div className="grid md:grid-cols-4 gap-3">
                  {QUESTION_CATEGORIES.academic.questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-sm hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-300/30 rounded-lg px-4 py-3 text-left text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Well-being & Balance Row */}
              <div>
                <h3 className="text-white font-bold mb-3 text-xl drop-shadow-lg bg-gradient-to-r from-pink-400 to-rose-400 px-4 py-2 rounded-lg inline-block">
                  {QUESTION_CATEGORIES.wellbeing.title}
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {QUESTION_CATEGORIES.wellbeing.questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-sm hover:from-pink-500/30 hover:to-rose-500/30 border border-pink-300/30 rounded-lg px-4 py-3 text-left text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id || msg.created_at}>
                {/* User Message */}
                <div className="flex justify-end mb-2">
                  <div className="bg-primary-600 text-white rounded-lg px-4 py-2 max-w-md">
                    <p>{msg.message}</p>
                  </div>
                </div>

                {/* ZENI Response */}
                {msg.response && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 max-w-md shadow-lg border border-white/30">
                      <p className="text-gray-800">{msg.response}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {/* Show remaining questions below conversation by category */}
            {getRemainingQuestions().length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/30">
                <p className="text-white/90 text-base mb-6 font-semibold text-center">
                  You might also want to ask:
                </p>
                <div className="space-y-6 max-w-5xl mx-auto">
                  {/* Stress & Anxiety */}
                  {getRemainingQuestionsByCategory('stress').length > 0 && (
                    <div>
                      <h3 className="text-white font-bold mb-3 text-xl drop-shadow-lg bg-gradient-to-r from-red-400 to-orange-400 px-4 py-2 rounded-lg inline-block">
                        {QUESTION_CATEGORIES.stress.title}
                      </h3>
                      <div className="grid md:grid-cols-4 gap-3">
                        {getRemainingQuestionsByCategory('stress').map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuestionClick(question)}
                            className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm hover:from-red-500/30 hover:to-orange-500/30 border border-red-300/30 rounded-lg px-4 py-3 text-left text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Motivation & Productivity */}
                  {getRemainingQuestionsByCategory('motivation').length > 0 && (
                    <div>
                      <h3 className="text-white font-bold mb-3 text-xl drop-shadow-lg bg-gradient-to-r from-blue-400 to-cyan-400 px-4 py-2 rounded-lg inline-block">
                        {QUESTION_CATEGORIES.motivation.title}
                      </h3>
                      <div className="grid md:grid-cols-4 gap-3">
                        {getRemainingQuestionsByCategory('motivation').map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuestionClick(question)}
                            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-300/30 rounded-lg px-4 py-3 text-left text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Academic & Study */}
                  {getRemainingQuestionsByCategory('academic').length > 0 && (
                    <div>
                      <h3 className="text-white font-bold mb-3 text-xl drop-shadow-lg bg-gradient-to-r from-purple-400 to-indigo-400 px-4 py-2 rounded-lg inline-block">
                        {QUESTION_CATEGORIES.academic.title}
                      </h3>
                      <div className="grid md:grid-cols-4 gap-3">
                        {getRemainingQuestionsByCategory('academic').map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuestionClick(question)}
                            className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-sm hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-300/30 rounded-lg px-4 py-3 text-left text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Well-being & Balance */}
                  {getRemainingQuestionsByCategory('wellbeing').length > 0 && (
                    <div>
                      <h3 className="text-white font-bold mb-3 text-xl drop-shadow-lg bg-gradient-to-r from-pink-400 to-rose-400 px-4 py-2 rounded-lg inline-block">
                        {QUESTION_CATEGORIES.wellbeing.title}
                      </h3>
                      <div className="grid md:grid-cols-3 gap-3">
                        {getRemainingQuestionsByCategory('wellbeing').map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuestionClick(question)}
                            className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-sm hover:from-pink-500/30 hover:to-rose-500/30 border border-pink-300/30 rounded-lg px-4 py-3 text-left text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}

