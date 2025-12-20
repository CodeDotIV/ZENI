'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Chat() {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    checkAuth()
    fetchChatHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }

  const fetchChatHistory = () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        const chatHistory = JSON.parse(localStorage.getItem(`zeni_chat_${user.id}`) || '[]')
        setMessages(chatHistory)
      }
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const saveMessage = (message) => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      const chatHistory = JSON.parse(localStorage.getItem(`zeni_chat_${user.id}`) || '[]')
      chatHistory.push(message)
      localStorage.setItem(`zeni_chat_${user.id}`, JSON.stringify(chatHistory))
    }
  }

  const generateResponse = (userMessage) => {
    // Simple mock responses based on keywords
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
      return "I understand you're feeling stressed. That's completely normal, especially during school. Take a deep breath. What specifically is making you feel this way? I'm here to listen."
    }
    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('sleep')) {
      return "It sounds like you're feeling tired. Rest is important for your well-being. Have you been getting enough sleep? Remember, taking care of yourself is just as important as your studies."
    }
    if (lowerMessage.includes('homework') || lowerMessage.includes('assignment') || lowerMessage.includes('deadline')) {
      return "I can help you organize your assignments! Would you like me to help you break down your tasks into smaller, manageable steps? Sometimes it helps to tackle one thing at a time."
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hi! I'm ZENI, your AI companion. I'm here to support you and help you stay organized. How are you feeling today? What can I help you with?"
    }
    if (lowerMessage.includes('help')) {
      return "I'm here to help! I can assist you with organizing your schedule, managing tasks, or just listening when you need someone to talk to. What would you like help with?"
    }
    
    // Default empathetic response
    return "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about what's on your mind? Remember, it's okay to not be okay sometimes."
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message immediately
    const tempUserMessage = {
      id: Date.now(),
      message: userMessage,
      response: null,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])
    saveMessage(tempUserMessage)

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(userMessage)
      const updatedMessage = {
        ...tempUserMessage,
        response: response,
        sentiment: 'neutral'
      }
      
      setMessages(prev => prev.map(msg =>
        msg.id === tempUserMessage.id ? updatedMessage : msg
      ))
      saveMessage(updatedMessage)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-warm-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
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
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mx-auto mb-4">❤️</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Hi! I'm ZENI</h2>
            <p className="text-gray-600">
              I'm here to listen and support you. What's on your mind?
            </p>
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
                    <div className="bg-white rounded-lg px-4 py-2 max-w-md shadow-sm">
                      <p className="text-gray-800">{msg.response}</p>
                    </div>
                  </div>
                )}

                {!msg.response && loading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white rounded-lg px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>📤</span>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

