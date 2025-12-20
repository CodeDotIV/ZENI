'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
// Icons temporarily removed - install lucide-react to restore
// import { Send, Heart } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(response.data.messages || [])
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/api/chat`,
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Update message with response
      setMessages(prev => prev.map(msg =>
        msg.id === tempUserMessage.id
          ? { ...msg, response: response.data.response, sentiment: response.data.sentiment }
          : msg
      ))

      // Show crisis resources if needed
      if (response.data.crisis_detected) {
        setTimeout(() => {
          alert('If you\'re in crisis, please reach out:\n- Crisis Text Line: Text HOME to 741741\n- National Suicide Prevention Lifeline: 988')
        }, 500)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.map(msg =>
        msg.id === tempUserMessage.id
          ? { ...msg, response: "I'm having trouble right now. Can you try again?" }
          : msg
      ))
    } finally {
      setLoading(false)
    }
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

