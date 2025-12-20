'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white font-semibold">Loading ZENI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
             Welcome <span className="text-yellow-300">ZENI</span>
          </h1>
          <p className="text-2xl text-white/90 mb-8 drop-shadow-md">
            Your AI student companion who organizes your life without you having to think about it
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/90 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg text-lg font-semibold border-2 border-white/50 hover:bg-white/30 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/30">
            <div className="w-12 h-12 text-primary-600 mb-4 text-4xl">📅</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Smart Organization</h3>
            <p className="text-gray-700">
              Upload your syllabus and I'll organize everything automatically. No templates, no setup.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/30">
            <div className="w-12 h-12 text-primary-600 mb-4 text-4xl">💬</div>
            <h3 className="text-xl font-semibold mb-2">Empathetic Support</h3>
            <p className="text-gray-600">
              I'm here to listen and support you, not judge. Talk to me anytime you're feeling stressed.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/30">
            <div className="w-12 h-12 text-primary-600 mb-4 text-4xl">❤️</div>
            <h3 className="text-xl font-semibold mb-2">Mental Health First</h3>
            <p className="text-gray-600">
              Your well-being matters. I help you manage stress and recognize when you need support.
            </p>
          </div>
        </div>

        {/* Why ZENI */}
        <div className="mt-16 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Why ZENI?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <span className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1 text-gray-800">Zero Setup</h4>
                <p className="text-gray-700">No templates, no complex onboarding. Just talk to me.</p>
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

