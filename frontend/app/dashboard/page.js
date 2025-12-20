'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchTasks()
  }, [])

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

  const fetchTasks = () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        const userTasks = JSON.parse(localStorage.getItem(`zeni_tasks_${user.id}`) || '[]')
        setTasks(userTasks)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    )
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const todayTasks = pendingTasks.filter(t => {
    if (!t.deadline) return false
    const today = new Date().toDateString()
    const taskDate = new Date(t.deadline).toDateString()
    return today === taskDate
  })
  const completedTasks = tasks.filter(t => t.status === 'completed')
  const upcomingTasks = tasks.filter(t => {
    if (!t.deadline) return false
    const today = new Date()
    const taskDate = new Date(t.deadline)
    return taskDate > today && taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">ZENI</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Hi, {user?.first_name || 'there'}! 👋</span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">Today's Tasks</p>
                <p className="text-3xl font-bold text-white">{todayTasks.length}</p>
              </div>
              <span className="text-4xl animate-bounce">📅</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">Pending Tasks</p>
                <p className="text-3xl font-bold text-white">{pendingTasks.length}</p>
              </div>
              <span className="text-4xl animate-pulse">⏰</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-white">{completedTasks.length}</p>
              </div>
              <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>✅</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">Upcoming (7 days)</p>
                <p className="text-3xl font-bold text-white">{upcomingTasks.length}</p>
              </div>
              <span className="text-4xl animate-pulse" style={{ animationDelay: '0.4s' }}>📆</span>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-bounce">👋</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back, {user?.first_name || 'Student'}!</h2>
              <p className="text-white/90">Ready to tackle your day? Let's get organized together.</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Tasks List */}
          <div className="md:col-span-2 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
              <button
                onClick={() => router.push('/tasks/new')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">+</span>
                New Task
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce">📝</div>
                <p className="text-gray-700 mb-4 text-lg font-medium">No tasks yet!</p>
                <button
                  onClick={() => router.push('/tasks/new')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Create your first task
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 10).map((task, index) => (
                  <div
                    key={task.id}
                    className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:border-indigo-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                          {task.priority && (
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                        )}
                        {task.deadline && (
                          <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                            <span>📅</span>
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
              <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/chat')}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-lg">💬</span>
                  Chat with ZENI
                </button>
                <button
                  onClick={() => router.push('/syllabus/upload')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-lg">📄</span>
                  Upload Syllabus
                </button>
                <button
                  onClick={() => router.push('/schedule')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-lg">📅</span>
                  View Schedule
                </button>
                <button
                  onClick={() => router.push('/mental-health')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-lg">❤️</span>
                  Mental Health Check
                </button>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
              <h3 className="text-xl font-bold mb-4 text-white">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/90 text-sm">Task Completion</span>
                    <span className="text-white font-bold">
                      {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-3">
                    <div
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/30">
                  <div className="flex justify-between items-center">
                    <span className="text-white/90 text-sm">Total Tasks</span>
                    <span className="text-white font-bold text-lg">{tasks.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            {upcomingTasks.length > 0 && (
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
                <h3 className="text-xl font-bold mb-4 text-white">⚠️ Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {upcomingTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                      <p className="text-white font-semibold text-sm">{task.title}</p>
                      <p className="text-white/80 text-xs mt-1">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motivational Quote */}
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
              <div className="text-4xl mb-3 text-center animate-pulse">✨</div>
              <p className="text-white/90 text-sm italic text-center">
                "You're doing great! Keep up the amazing work. Every task completed is a step closer to your goals."
              </p>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-slate-600 to-gray-700 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Recent Activity
            </h3>
            <div className="space-y-3">
              {/* Show completed tasks */}
              {completedTasks.slice(0, 2).map(task => (
                <div key={task.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 transform hover:scale-105 transition-all duration-300">
                  <span className="text-2xl animate-pulse">✅</span>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{task.title}</p>
                    <p className="text-white/70 text-xs">
                      Completed {task.updated_at ? new Date(task.updated_at).toLocaleDateString() : 'recently'}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Show recently created tasks */}
              {tasks
                .filter(t => t.status === 'pending')
                .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
                .slice(0, 2)
                .map(task => (
                  <div key={task.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 transform hover:scale-105 transition-all duration-300">
                    <span className="text-2xl">➕</span>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{task.title}</p>
                      <p className="text-white/70 text-xs">
                        Created {task.created_at ? new Date(task.created_at).toLocaleDateString() : 'recently'}
                      </p>
                    </div>
                  </div>
                ))}
              
              {/* Show upcoming deadlines */}
              {upcomingTasks.slice(0, 1).map(task => (
                <div key={task.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 transform hover:scale-105 transition-all duration-300">
                  <span className="text-2xl animate-bounce">⏰</span>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{task.title}</p>
                    <p className="text-white/70 text-xs">
                      Due {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'soon'}
                    </p>
                  </div>
                </div>
              ))}
              
              {completedTasks.length === 0 && tasks.filter(t => t.status === 'pending').length === 0 && (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-white/70 text-sm">No recent activity</p>
                  <button
                    onClick={() => router.push('/tasks/new')}
                    className="mt-3 text-white/90 hover:text-white text-sm underline"
                  >
                    Create your first task
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Study Tips */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
            <h3 className="text-xl font-bold mb-4 text-white">💡 Study Tips</h3>
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-white text-sm">Take breaks every 25-30 minutes for better focus</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-white text-sm">Review your notes within 24 hours for better retention</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-white text-sm">Stay hydrated and get enough sleep for optimal performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

