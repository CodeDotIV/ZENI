'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTask() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    status: 'pending'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.title.trim()) {
        setError('Title is required')
        setLoading(false)
        return
      }

      const userData = localStorage.getItem('user')
      if (!userData) {
        router.push('/login')
        return
      }

      const user = JSON.parse(userData)
      
      // Get existing tasks
      const existingTasks = JSON.parse(localStorage.getItem(`zeni_tasks_${user.id}`) || '[]')
      
      // Create new task
      const newTask = {
        id: 'task-' + Date.now(),
        title: formData.title,
        description: formData.description || null,
        deadline: formData.deadline || null,
        priority: formData.priority,
        status: formData.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // Add to tasks
      existingTasks.push(newTask)
      localStorage.setItem(`zeni_tasks_${user.id}`, JSON.stringify(existingTasks))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Failed to create task. Please try again.')
      console.error('Error creating task:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
            Create New Task
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-lg">
            Add a New Task
          </h2>

          {error && (
            <div className="bg-red-500/90 backdrop-blur-sm border border-red-300 text-white px-4 py-3 rounded-lg mb-4 shadow-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2 drop-shadow-sm">
                Task Title <span className="text-red-300">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-300"
                placeholder="e.g., Complete Math Assignment"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2 drop-shadow-sm">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-300 resize-none"
                placeholder="Add any additional details about this task..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2 drop-shadow-sm">
                  Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-gray-800 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2 drop-shadow-sm">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-gray-800 transition-all duration-300"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold border-2 border-white/50 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span>
                    Creating...
                  </span>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

