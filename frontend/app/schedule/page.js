'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Schedule() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState('week') // 'day', 'week', 'month'

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

  const getTasksForDate = (date) => {
    if (!date) return []
    const dateStr = date.split('T')[0]
    return tasks.filter(task => {
      if (!task.deadline) return false
      const taskDate = new Date(task.deadline).toISOString().split('T')[0]
      return taskDate === dateStr
    })
  }

  const getWeekDates = () => {
    const selected = new Date(selectedDate)
    const startOfWeek = new Date(selected)
    startOfWeek.setDate(selected.getDate() - selected.getDay())
    
    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      week.push(date)
    }
    return week
  }

  const getMonthDates = () => {
    const selected = new Date(selectedDate)
    const year = selected.getFullYear()
    const month = selected.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())
    
    const dates = []
    const current = new Date(startDate)
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const navigateDate = (direction) => {
    const current = new Date(selectedDate)
    if (viewMode === 'day') {
      current.setDate(current.getDate() + direction)
    } else if (viewMode === 'week') {
      current.setDate(current.getDate() + (direction * 7))
    } else {
      current.setMonth(current.getMonth() + direction)
    }
    setSelectedDate(current.toISOString().split('T')[0])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    )
  }

  const todayTasks = getTasksForDate(selectedDate)
  const weekDates = getWeekDates()
  const monthDates = getMonthDates()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              📅 My Schedule
            </h1>
          </div>
          <button
            onClick={() => router.push('/tasks/new')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>+</span>
            New Task
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* View Controls */}
        <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-white/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'day'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'week'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'month'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                Month
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate(-1)}
                className="bg-white/50 hover:bg-white/70 text-gray-700 px-3 py-2 rounded-lg transition-all"
              >
                ←
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700"
              />
              <button
                onClick={() => navigateDate(1)}
                className="bg-white/50 hover:bg-white/70 text-gray-700 px-3 py-2 rounded-lg transition-all"
              >
                →
              </button>
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Day View */}
        {viewMode === 'day' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {formatDate(new Date(selectedDate))}
            </h2>
            {todayTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-gray-600 text-lg">No tasks scheduled for this day</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayTasks.map(task => (
                  <div
                    key={task.id}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                        {task.description && (
                          <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority} priority
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(task.deadline).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
        )}

        {/* Week View */}
        {viewMode === 'week' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Week of {formatDate(weekDates[0])}
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, index) => {
                const dayTasks = getTasksForDate(date.toISOString())
                return (
                  <div
                    key={index}
                    className={`min-h-[200px] p-3 rounded-lg border-2 ${
                      isToday(date)
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-500'
                        : 'bg-white/50 border-gray-200'
                    }`}
                  >
                    <div className={`font-bold mb-2 ${isToday(date) ? 'text-green-700' : 'text-gray-700'}`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-sm mb-2 ${isToday(date) ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1 mt-2">
                      {dayTasks.slice(0, 3).map(task => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded truncate ${
                            task.priority === 'high' ? 'bg-red-200 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                          }`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Month View */}
        {viewMode === 'month' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold text-gray-700 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthDates.map((date, index) => {
                const dayTasks = getTasksForDate(date.toISOString())
                const isCurrentMonth = date.getMonth() === new Date(selectedDate).getMonth()
                return (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 rounded-lg border ${
                      isToday(date)
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-500'
                        : isCurrentMonth
                        ? 'bg-white/50 border-gray-200'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday(date) ? 'text-green-700' :
                      isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 2).map(task => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded truncate ${
                            task.priority === 'high' ? 'bg-red-200 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-green-200 text-green-800'
                          }`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayTasks.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Upcoming Tasks Summary */}
        <div className="mt-8 bg-gradient-to-br from-yellow-400 to-orange-500 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30">
          <h3 className="text-xl font-bold text-white mb-4">📋 Upcoming Tasks</h3>
          <div className="space-y-2">
            {tasks
              .filter(t => t.deadline && new Date(t.deadline) > new Date() && t.status !== 'completed')
              .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
              .slice(0, 5)
              .map(task => (
                <div key={task.id} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">{task.title}</p>
                      <p className="text-white/80 text-sm">
                        {new Date(task.deadline).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.priority === 'high' ? 'bg-red-500 text-white' :
                      task.priority === 'medium' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            {tasks.filter(t => t.deadline && new Date(t.deadline) > new Date() && t.status !== 'completed').length === 0 && (
              <p className="text-white/80 text-center py-4">No upcoming tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

