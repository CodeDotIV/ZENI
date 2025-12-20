'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('zeni_users') || '[]')
      
      if (isLogin) {
        // Login: Find user by email
        const user = users.find(u => u.email === formData.email)
        if (!user || user.password !== formData.password) {
          setError('Invalid email or password')
          setLoading(false)
          return
        }
        
        // Set user data
        localStorage.setItem('token', 'demo-token-' + user.id)
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          onboarding_complete: user.onboarding_complete || false
        }))
        
        if (!user.onboarding_complete) {
          router.push('/onboarding')
        } else {
          router.push('/dashboard')
        }
      } else {
        // Register: Check if user exists
        if (users.find(u => u.email === formData.email)) {
          setError('User already exists')
          setLoading(false)
          return
        }
        
        // Create new user
        const newUser = {
          id: 'user-' + Date.now(),
          email: formData.email,
          password: formData.password, // In real app, hash this
          first_name: formData.first_name || '',
          onboarding_complete: false
        }
        
        users.push(newUser)
        localStorage.setItem('zeni_users', JSON.stringify(users))
        
        // Set user data
        localStorage.setItem('token', 'demo-token-' + newUser.id)
        localStorage.setItem('user', JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          onboarding_complete: false
        }))
        
        router.push('/onboarding')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md border border-white/30 transform hover:scale-[1.02] transition-all duration-300">
        <h1 className="text-3xl font-bold text-center mb-2 text-white drop-shadow-lg">
          {isLogin ? 'Welcome Back!' : 'Join ZENI'}
        </h1>
        <p className="text-center text-white/90 mb-8 drop-shadow-md">
          {isLogin ? 'Sign in to continue' : 'Start your journey with ZENI'}
        </p>

        {error && (
          <div className="bg-red-500/90 backdrop-blur-sm border border-red-300 text-white px-4 py-3 rounded-lg mb-4 shadow-lg animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-white mb-1 drop-shadow-sm">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-300"
                placeholder="Maya"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-1 drop-shadow-sm">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1 drop-shadow-sm">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Loading...
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/90 hover:text-white transition-all duration-300 font-medium hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

