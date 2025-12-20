'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
// Icons temporarily removed - install lucide-react to restore
// import { Heart, Calendar, MessageCircle, CheckCircle } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        setIsAuthenticated(true)
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ZENI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-warm-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Hi! I'm <span className="text-primary-600">ZENI</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Your AI student companion who organizes your life without you having to think about it
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 text-primary-600 mb-4 text-4xl">📅</div>
            <h3 className="text-xl font-semibold mb-2">Smart Organization</h3>
            <p className="text-gray-600">
              Upload your syllabus and I'll organize everything automatically. No templates, no setup.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 text-primary-600 mb-4 text-4xl">💬</div>
            <h3 className="text-xl font-semibold mb-2">Empathetic Support</h3>
            <p className="text-gray-600">
              I'm here to listen and support you, not judge. Talk to me anytime you're feeling stressed.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 text-primary-600 mb-4 text-4xl">❤️</div>
            <h3 className="text-xl font-semibold mb-2">Mental Health First</h3>
            <p className="text-gray-600">
              Your well-being matters. I help you manage stress and recognize when you need support.
            </p>
          </div>
        </div>

        {/* Why ZENI */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Why ZENI?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <span className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Zero Setup</h4>
                <p className="text-gray-600">No templates, no complex onboarding. Just talk to me.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Fully Automated</h4>
                <p className="text-gray-600">I learn your patterns and adapt to help you better.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Empathetic AI</h4>
                <p className="text-gray-600">I understand you're human, not a productivity machine.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1">Student-Focused</h4>
                <p className="text-gray-600">Built specifically for students, by understanding student needs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

