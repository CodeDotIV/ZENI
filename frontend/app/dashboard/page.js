'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [allTasks, setAllTasks] = useState([]) // Store all tasks for filtering
  const [filter, setFilter] = useState('today') // 'today', 'upcoming', 'completed', 'all', 'pending'
  const [loading, setLoading] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const profileRef = useRef(null)
  const fileInputRef = useRef(null)
  const studyTipsRef = useRef(null)

  const studyTips = [
    "Take breaks every 25-30 minutes for better focus",
    "Review your notes within 24 hours for better retention",
    "Stay hydrated and get enough sleep for optimal performance",
    "Use the Pomodoro Technique: 25 minutes study, 5 minutes break",
    "Create a dedicated study space free from distractions",
    "Teach what you've learned to someone else to reinforce knowledge",
    "Use active recall instead of passive reading",
    "Break down large topics into smaller, manageable chunks",
    "Practice spaced repetition to improve long-term memory",
    "Use mnemonic devices to remember complex information",
    "Take handwritten notes instead of typing for better retention",
    "Study at the same time each day to build a routine",
    "Get 7-9 hours of sleep for optimal cognitive function",
    "Exercise regularly to boost brain function and memory",
    "Use flashcards for quick review sessions",
    "Avoid multitasking - focus on one subject at a time",
    "Connect new information to things you already know",
    "Take practice tests to identify knowledge gaps",
    "Use different study methods to keep learning engaging",
    "Reward yourself after completing study sessions"
  ]

  useEffect(() => {
    checkAuth()
    fetchTasks()
    
    // Hide welcome message after 10 seconds
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false)
    }, 10000)
    
    // Refresh tasks when window regains focus (user returns from another tab/page)
    const handleFocus = () => {
      fetchTasks()
    }
    window.addEventListener('focus', handleFocus)
    
    // Auto-scroll study tips
    const scrollStudyTips = () => {
      if (studyTipsRef.current) {
        const container = studyTipsRef.current
        const scrollHeight = container.scrollHeight
        const clientHeight = container.clientHeight
        
        if (scrollHeight > clientHeight) {
          let scrollPosition = container.scrollTop
          scrollPosition += 0.5 // Slow scroll speed
          
          // Reset to top when reaching bottom
          if (scrollPosition >= scrollHeight - clientHeight) {
            scrollPosition = 0
          }
          
          container.scrollTop = scrollPosition
        }
      }
    }
    
    const scrollInterval = setInterval(scrollStudyTips, 50) // Update every 50ms for smooth scrolling
    
    return () => {
      clearTimeout(welcomeTimer)
      clearInterval(scrollInterval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [allTasks.length])

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
        setAllTasks(userTasks)
        applyFilter(filter, userTasks)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = (filterType, taskList = allTasks) => {
    setFilter(filterType)
    let filtered = []
    
    switch (filterType) {
      case 'all':
        filtered = taskList
        break
      case 'pending':
        filtered = taskList.filter(t => t.status === 'pending')
        break
      case 'completed':
        filtered = taskList.filter(t => t.status === 'completed')
        break
      case 'upcoming':
        filtered = taskList.filter(t => {
          if (!t.deadline || t.status === 'completed') return false
          const today = new Date()
          const taskDate = new Date(t.deadline)
          return taskDate > today && taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        })
        break
      case 'today':
        filtered = taskList.filter(t => {
          if (!t.deadline || t.status === 'completed') return false
          const today = new Date().toDateString()
          const taskDate = new Date(t.deadline).toDateString()
          return today === taskDate
        })
        break
      default:
        filtered = taskList
    }
    
    setTasks(filtered)
  }

  const toggleTaskStatus = (taskId) => {
    try {
      const userData = localStorage.getItem('user')
      if (!userData) return
      
      const user = JSON.parse(userData)
      const userTasksKey = `zeni_tasks_${user.id}`
      const userTasks = JSON.parse(localStorage.getItem(userTasksKey) || '[]')
      
      const updatedTasks = userTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: task.status === 'completed' ? 'pending' : 'completed',
            updated_at: new Date().toISOString()
          }
        }
        return task
      })
      
      localStorage.setItem(userTasksKey, JSON.stringify(updatedTasks))
      setAllTasks(updatedTasks)
      applyFilter(filter, updatedTasks)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      const userData = localStorage.getItem('user')
      if (!userData) return
      
      const user = JSON.parse(userData)
      const userTasksKey = `zeni_tasks_${user.id}`
      const userTasks = JSON.parse(localStorage.getItem(userTasksKey) || '[]')
      
      const updatedTasks = userTasks.filter(task => task.id !== taskId)
      localStorage.setItem(userTasksKey, JSON.stringify(updatedTasks))
      setAllTasks(updatedTasks)
      applyFilter(filter, updatedTasks)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const refreshDashboard = () => {
    setLoading(true)
    fetchTasks()
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${day}${month}${year} ${hours}:${minutes}:${seconds}`
  }

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }
    
    const reader = new FileReader()
    reader.onloadend = () => {
      try {
        const userData = localStorage.getItem('user')
        if (!userData) return
        
        const user = JSON.parse(userData)
        const updatedUser = {
          ...user,
          profile_picture: reader.result // Store as base64
        }
        
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // Also update in users list
        const users = JSON.parse(localStorage.getItem('zeni_users') || '[]')
        const userIndex = users.findIndex(u => u.id === user.id)
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], profile_picture: reader.result }
          localStorage.setItem('zeni_users', JSON.stringify(users))
        }
        
        setUser(updatedUser)
        alert('Profile picture updated successfully!')
      } catch (error) {
        console.error('Error saving profile picture:', error)
        alert('Error saving profile picture. Please try again.')
      }
    }
    reader.readAsDataURL(file)
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

  const pendingTasks = allTasks.filter(t => t.status === 'pending')
  // All tasks due today (for progress calculation)
  const allTodayTasks = allTasks.filter(t => {
    if (!t.deadline) return false
    const today = new Date().toDateString()
    const taskDate = new Date(t.deadline).toDateString()
    return today === taskDate
  })
  // Today's tasks excluding completed (for filter button)
  const todayTasks = allTodayTasks.filter(t => t.status !== 'completed')
  const completedTasks = allTasks.filter(t => t.status === 'completed')
  const upcomingTasks = allTasks.filter(t => {
    if (!t.deadline) return false
    const today = new Date()
    const taskDate = new Date(t.deadline)
    return taskDate > today && taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) && t.status === 'pending'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-500/90 via-blue-500/90 to-indigo-600/90 backdrop-blur-md shadow-lg border-b border-white/20 relative z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center relative">
            <h1 className="text-2xl font-bold text-white cursor-pointer hover:text-cyan-100 transition-colors" onClick={() => router.push('/dashboard')}>
              ZENI
            </h1>
          <div className="flex items-center gap-4">
            <div 
              className="relative z-50" 
              ref={profileRef}
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer group">
                {user?.profile_picture ? (
                  <img 
                    src={user.profile_picture} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/50 shadow-lg group-hover:border-white transition-all"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center shadow-lg group-hover:bg-white/40 transition-all">
                    <span className="text-xl">👤</span>
                  </div>
                )}
                <span className="text-sm font-semibold text-white">{user?.first_name || 'User'}</span>
                <svg className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
                  
              {/* Profile Dropdown - Classic Style */}
              {showProfile && (
                <div 
                  className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] animate-fadeIn overflow-hidden"
                  onMouseEnter={() => setShowProfile(true)}
                  onMouseLeave={() => setShowProfile(false)}
                >
                    {/* Profile Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                      {user?.profile_picture ? (
                        <img 
                          src={user.profile_picture} 
                          alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                      ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
                            <span className="text-lg">👤</span>
                        </div>
                      )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.first_name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                    </div>
                  </div>
                    </div>
                    
                    {/* Profile Info */}
                    <div className="px-4 py-3 max-h-80 overflow-y-auto">
                      <div className="space-y-2 text-sm">
                    {user?.field_of_study && (
                          <div className="py-1">
                            <p className="text-xs text-gray-500">Field of Study</p>
                            <p className="text-gray-900 font-medium">{user.field_of_study}</p>
                      </div>
                    )}
                        {user?.university && (
                          <div className="py-1">
                            <p className="text-xs text-gray-500">University</p>
                            <p className="text-gray-900 font-medium">{user.university}</p>
                      </div>
                    )}
                        {user?.year_of_study && (
                          <div className="py-1">
                            <p className="text-xs text-gray-500">Year of Study</p>
                            <p className="text-gray-900 font-medium">{user.year_of_study}</p>
                      </div>
                    )}
                    {user?.phone && (
                          <div className="py-1">
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-gray-900 font-medium">{user.phone}</p>
                      </div>
                    )}
                      </div>
                      </div>
                    
                    {/* Actions */}
                    <div className="border-t border-gray-200 px-2 py-2">
                      <button
                        onClick={() => {
                          fileInputRef.current?.click()
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
                      >
                        <span>📷</span>
                        Change Photo
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                    {(!user?.field_of_study || !user?.university || !user?.phone) && (
                      <button
                        onClick={() => {
                          setShowProfile(false)
                          router.push('/onboarding')
                        }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
                      >
                          <span>⚙️</span>
                          Complete Profile
                      </button>
                    )}
            <button
                        onClick={() => {
                          setShowProfile(false)
                          handleLogout()
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2 mt-1"
                      >
                        <span>🚪</span>
              Logout
            </button>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => applyFilter('today')}
            className={`bg-gradient-to-br from-blue-500 to-cyan-500 backdrop-blur-sm rounded-lg shadow-xl p-4 border-2 transition-all duration-300 cursor-pointer text-left transform hover:scale-105 ${
              filter === 'today' ? 'border-white ring-2 ring-white/50' : 'border-white/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-xs font-medium">Today's Tasks</p>
                <p className="text-2xl font-bold text-white">{todayTasks.length}</p>
              </div>
              <span className="text-2xl animate-bounce">📅</span>
            </div>
          </button>

          <button
            onClick={() => applyFilter('pending')}
            className={`bg-gradient-to-br from-orange-500 to-red-500 backdrop-blur-sm rounded-lg shadow-xl p-4 border-2 transition-all duration-300 cursor-pointer text-left transform hover:scale-105 ${
              filter === 'pending' ? 'border-white ring-2 ring-white/50' : 'border-white/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-xs font-medium">Pending Tasks</p>
                <p className="text-2xl font-bold text-white">{pendingTasks.length}</p>
              </div>
              <span className="text-2xl animate-pulse">⏰</span>
            </div>
          </button>

          <button
            onClick={() => applyFilter('completed')}
            className={`bg-gradient-to-br from-green-500 to-emerald-500 backdrop-blur-sm rounded-lg shadow-xl p-4 border-2 transition-all duration-300 cursor-pointer text-left transform hover:scale-105 ${
              filter === 'completed' ? 'border-white ring-2 ring-white/50' : 'border-white/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-xs font-medium">Completed</p>
                <p className="text-2xl font-bold text-white">{completedTasks.length}</p>
              </div>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>✅</span>
            </div>
          </button>

          <button
            onClick={() => applyFilter('upcoming')}
            className={`bg-gradient-to-br from-purple-500 to-pink-500 backdrop-blur-sm rounded-lg shadow-xl p-4 border-2 transition-all duration-300 cursor-pointer text-left transform hover:scale-105 ${
              filter === 'upcoming' ? 'border-white ring-2 ring-white/50' : 'border-white/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-xs font-medium">Upcoming (7 days)</p>
                <p className="text-2xl font-bold text-white">{upcomingTasks.length}</p>
              </div>
              <span className="text-2xl animate-pulse" style={{ animationDelay: '0.4s' }}>📆</span>
            </div>
          </button>

          {/* Motivational Quote */}
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-white/30 transform hover:scale-105 transition-all duration-300 flex flex-col justify-center">
            <div className="text-2xl mb-2 text-center animate-pulse">✨</div>
            <p className="text-white/90 text-xs italic text-center leading-tight">
              "You're doing great! Keep up the amazing work. Every task completed is a step closer to your goals."
            </p>
          </div>
        </div>

        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-8 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-[1.02] transition-all duration-300 animate-fadeIn">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-bounce">👋</div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Welcome back, {user?.first_name || 'Student'}!</h2>
                <p className="text-white/90">Ready to tackle your day? Let's get organized together.</p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="ml-auto text-white/80 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Recent Activity and Study Tips - Side by Side */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-slate-600 to-gray-700 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Recent Activity
            </h3>
            <div className="relative min-h-[120px]">
              {(() => {
                // Build array of all activity items
                const activityItems = []
                
                // Add completed tasks
                completedTasks.forEach(task => {
                  activityItems.push({
                    id: task.id,
                    type: 'completed',
                    title: task.title,
                    date: task.updated_at ? new Date(task.updated_at) : new Date(0),
                    dateString: task.updated_at ? formatDateTime(task.updated_at) : 'recently',
                    icon: '✅',
                    animate: 'animate-pulse'
                  })
                })
                
                // Add recently created tasks
                allTasks
                  .filter(t => t.status === 'pending')
                  .forEach(task => {
                    activityItems.push({
                      id: task.id,
                      type: 'created',
                      title: task.title,
                      date: task.created_at ? new Date(task.created_at) : new Date(0),
                      dateString: task.created_at ? formatDateTime(task.created_at) : 'recently',
                      icon: '➕',
                      animate: ''
                    })
                  })
                
                // Add upcoming deadlines
                upcomingTasks.forEach(task => {
                  activityItems.push({
                    id: task.id,
                    type: 'upcoming',
                    title: task.title,
                    date: task.deadline ? new Date(task.deadline) : new Date(0),
                    dateString: task.deadline ? formatDateTime(task.deadline) : 'soon',
                    icon: '⏰',
                    animate: 'animate-bounce'
                  })
                })
                
                // Sort by most recent first (by date, descending)
                activityItems.sort((a, b) => b.date - a.date)
                
                // Take only the 3 most recent
                const recentActivities = activityItems.slice(0, 3)
                
                if (recentActivities.length === 0) {
                  return (
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
                  )
                }
                
                return (
                  <div className="space-y-3">
                    {recentActivities.map((item) => (
                  <div 
                        key={item.id}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 transform hover:scale-105 transition-all duration-500 animate-fadeIn"
                  >
                        <span className={`text-2xl ${item.animate}`}>{item.icon}</span>
                    <div className="flex-1">
                          <p className="text-white font-medium text-sm">{item.title}</p>
                      <p className="text-white/70 text-xs">
                            {item.type === 'completed' && 'Completed '}
                            {item.type === 'created' && 'Created '}
                            {item.type === 'upcoming' && 'Due '}
                            {item.dateString}
                      </p>
                    </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Study Tips */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
            <h3 className="text-xl font-bold mb-4 text-white">💡 Study Tips</h3>
            <div 
              ref={studyTipsRef}
              className="space-y-3 overflow-hidden"
              style={{ height: '200px' }}
            >
              {studyTips.map((tip, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <p className="text-white text-sm">{tip}</p>
                </div>
              ))}
              {/* Duplicate tips for seamless loop */}
              {studyTips.map((tip, index) => (
                <div key={`duplicate-${index}`} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <p className="text-white text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Tasks List */}
          <div className="md:col-span-2 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 backdrop-blur-sm rounded-xl shadow-2xl p-6 border-2 border-white/50">
            {/* Header with Icon and Stats */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Your Tasks</h2>
                    <p className="text-sm text-gray-600 font-medium">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} {filter !== 'all' && `(${filter})`}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push('/schedule')}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="text-lg">📅</span>
                    Schedule
                  </button>
                  <button
                    onClick={() => router.push('/tasks/new')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="text-lg">✨</span>
                    New Task
                  </button>
                </div>
              </div>
              {/* Filter Buttons with Icons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => applyFilter('today')}
                  className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    filter === 'today' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  <span>📅</span>
                  Today ({todayTasks.length})
                  </button>
                  <button
                    onClick={() => applyFilter('pending')}
                  className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                      filter === 'pending' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                  <span>⏳</span>
                    Pending ({pendingTasks.length})
                  </button>
                  <button
                    onClick={() => applyFilter('upcoming')}
                  className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                      filter === 'upcoming' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                  <span>📆</span>
                    Upcoming ({upcomingTasks.length})
                  </button>
                  <button
                    onClick={() => applyFilter('completed')}
                  className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                      filter === 'completed' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                  <span>✅</span>
                    Completed ({completedTasks.length})
                </button>
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                {filter === 'today' && (
                  <>
                    <div className="text-9xl mb-8 animate-pulse flex items-center justify-center">📋</div>
                    <p className="text-gray-700 mb-2 text-xl font-semibold text-center">No Tasks Today</p>
                    <p className="text-gray-500 text-sm text-center max-w-md">You're all caught up! No tasks due today.</p>
                  </>
                )}
                {filter === 'upcoming' && (
                  <>
                    <div className="text-9xl mb-8 animate-bounce flex items-center justify-center">📅</div>
                    <p className="text-gray-700 mb-2 text-xl font-semibold text-center">No Upcoming Tasks</p>
                    <p className="text-gray-500 text-sm text-center max-w-md">Great! No tasks scheduled for the next 7 days.</p>
                  </>
                )}
                {filter === 'pending' && (
                  <>
                    <div className="text-9xl mb-8 animate-pulse flex items-center justify-center">⏰</div>
                    <p className="text-gray-700 mb-2 text-xl font-semibold text-center">No Pending Tasks</p>
                    <p className="text-gray-500 text-sm text-center max-w-md">Great! All your tasks are either completed or scheduled.</p>
                  </>
                )}
                {filter === 'completed' && (
                  <>
                    <div className="text-9xl mb-8 animate-pulse flex items-center justify-center">✅</div>
                    <p className="text-gray-700 mb-2 text-xl font-semibold text-center">No Completed Tasks Yet</p>
                    <p className="text-gray-500 text-sm text-center max-w-md">Start completing tasks to see your progress here!</p>
                  </>
                )}
                {filter !== 'today' && filter !== 'pending' && filter !== 'upcoming' && filter !== 'completed' && (
                  <>
                    <div className="text-9xl mb-8 animate-bounce flex items-center justify-center">📝</div>
                    <p className="text-gray-700 mb-2 text-xl font-semibold text-center">No tasks yet!</p>
                    <p className="text-gray-500 text-sm text-center max-w-md">Get started by creating your first task.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 10).map((task, index) => {
                  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed'
                  return (
                  <div
                    key={task.id}
                      className={`group relative bg-gradient-to-br ${
                        task.status === 'completed' 
                          ? 'from-green-50 to-emerald-50 border-green-200' 
                          : isOverdue
                          ? 'from-red-50 to-pink-50 border-red-200'
                          : 'from-white to-blue-50 border-gray-200'
                      } border-2 rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] hover:border-indigo-400`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Priority Indicator Bar */}
                      {task.priority === 'high' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-l-xl"></div>
                      )}
                      {task.priority === 'medium' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-l-xl"></div>
                      )}
                      {task.priority === 'low' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-l-xl"></div>
                      )}
                      
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-3">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                              task.status === 'completed' 
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-600 shadow-md' 
                                  : 'border-gray-300 hover:border-green-500 bg-white hover:bg-green-50'
                            }`}
                            title={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                              {task.status === 'completed' && <span className="text-white text-sm font-bold">✓</span>}
                          </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`font-bold text-lg ${
                            task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'
                          }`}>
                            {task.title}
                          </h3>
                          {task.priority && (
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                                    task.priority === 'high' ? 'bg-red-500 text-white' :
                                    task.priority === 'medium' ? 'bg-yellow-500 text-white' :
                                    'bg-green-500 text-white'
                                  }`}>
                                    {task.priority.toUpperCase()}
                                  </span>
                                )}
                                {isOverdue && (
                                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-sm animate-pulse">
                                    OVERDUE
                            </span>
                          )}
                        </div>
                        {task.description && (
                                <p className={`text-sm mt-2 ${
                            task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {task.description}
                          </p>
                        )}
                              <div className="flex items-center gap-4 mt-3 flex-wrap">
                        {task.deadline && (
                                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                                    task.status === 'completed' 
                                      ? 'bg-gray-100 text-gray-500' 
                                      : isOverdue
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    <span className="text-sm">📅</span>
                                    <span className="text-xs font-medium">
                                      {new Date(task.deadline).toLocaleDateString()} {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                        )}
                        {task.status === 'completed' && task.updated_at && (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-100 text-green-700">
                                    <span className="text-sm">✅</span>
                                    <span className="text-xs font-medium">Completed</span>
                                  </div>
                        )}
                      </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            task.status === 'completed' ? 'bg-green-500 text-white' :
                            task.status === 'in_progress' ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                          title="Delete task"
                        >
                            <span className="text-lg">🗑️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  )
                })}
                {tasks.length > 10 && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => {
                        // Show all tasks (you could create a dedicated page for this)
                        alert(`Showing first 10 of ${tasks.length} tasks. All tasks are visible in the Schedule page.`)
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                      View all {tasks.length} tasks in Schedule →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Your Progress */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
              <h3 className="text-xl font-bold mb-4 text-white">Your Progress</h3>
              <div className="space-y-4">
                {/* Today's Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/90 text-sm">Today's Progress</span>
                    <span className="text-white font-bold">
                      {allTodayTasks.length > 0 ? Math.round((allTodayTasks.filter(t => t.status === 'completed').length / allTodayTasks.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-3">
                    <div
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${allTodayTasks.length > 0 ? (allTodayTasks.filter(t => t.status === 'completed').length / allTodayTasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-white/70 text-xs">
                      {allTodayTasks.filter(t => t.status === 'completed').length} of {allTodayTasks.length} completed
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-white/30"></div>
                
                {/* Overall Progress */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/90 text-sm">Overall Progress</span>
                    <span className="text-white font-bold">
                      {allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-3">
                    <div
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-white/70 text-xs">
                      {completedTasks.length} of {allTasks.length} completed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
              <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/schedule')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-lg">📅</span>
                  View Schedule
                </button>
                <button
                  onClick={() => applyFilter('pending')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-lg">📋</span>
                  View Pending Tasks
                </button>
                <button
                  onClick={() => applyFilter('completed')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-lg">✅</span>
                  View Completed
                </button>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            {upcomingTasks.length > 0 && (
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">⚠️ Upcoming Deadlines</h3>
                  <button
                    onClick={() => router.push('/schedule')}
                    className="text-white/80 hover:text-white text-xs underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {upcomingTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30 cursor-pointer hover:bg-white/30 transition transform hover:scale-105"
                      onClick={() => router.push('/schedule')}
                    >
                      <p className="text-white font-semibold text-sm">{task.title}</p>
                      <p className="text-white/80 text-xs mt-1">
                        Due: {new Date(task.deadline).toLocaleDateString()} {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

            </div>

      {/* Floating Chat with ZENI - Jumping Cat */}
      <button
        onClick={() => router.push('/chat')}
        className="fixed bottom-6 right-6 z-50 group cursor-pointer"
        title="Chat with ZENI"
      >
        <div className="relative">
          {/* Speech bubble with "hello" */}
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-lg text-sm font-semibold whitespace-nowrap opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse">
            hello
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        </div>

          {/* Jumping Cat */}
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-full p-4 shadow-2xl border-2 border-white/50 hover:scale-110 transition-transform duration-300 cat-jump">
            <span className="text-4xl block">🐱</span>
      </div>
        </div>
      </button>

      <style jsx global>{`
        @keyframes catJump {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .cat-jump {
          animation: catJump 1.2s ease-in-out infinite;
        }
        .cat-jump:hover {
          animation: none;
        }
      `}</style>
    </div>
  )
}

