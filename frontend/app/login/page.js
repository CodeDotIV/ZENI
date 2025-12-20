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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-warm-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          {isLogin ? 'Welcome Back!' : 'Join ZENI'}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {isLogin ? 'Sign in to continue' : 'Start your journey with ZENI'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Maya"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-600 hover:text-primary-700"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

