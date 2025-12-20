'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  { 
    id: 'field_of_study', 
    question: "What are you studying?", 
    type: 'text', 
    required: true,
    emoji: '📚',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'num_classes', 
    question: "How many classes are you taking this semester?", 
    type: 'number', 
    required: true,
    emoji: '🎓',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'year_of_study', 
    question: "What year are you in?", 
    type: 'select', 
    options: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'], 
    required: true,
    emoji: '📅',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'university', 
    question: "Which university/institution are you studying at?", 
    type: 'text', 
    required: true,
    emoji: '🏛️',
    color: 'from-orange-500 to-red-500'
  },
  { 
    id: 'phone', 
    question: "What's your phone number?", 
    type: 'text', 
    required: true,
    emoji: '📱',
    color: 'from-indigo-500 to-purple-500'
  },
  { 
    id: 'extracurriculars', 
    question: "Do you have any clubs or activities outside of classes?", 
    type: 'text', 
    required: false,
    emoji: '⚽',
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    id: 'wake_time', 
    question: "What time do you usually wake up? (e.g., 8:00 AM)", 
    type: 'text', 
    required: false,
    emoji: '⏰',
    color: 'from-pink-500 to-rose-500'
  },
  { 
    id: 'energy_pattern', 
    question: "Are you a morning person or night owl?", 
    type: 'select', 
    options: ['Morning person 🌅', 'Night owl 🦉', 'Neither 😴'], 
    required: false,
    emoji: '⚡',
    color: 'from-cyan-500 to-blue-500'
  },
  { 
    id: 'biggest_stress', 
    question: "What stresses you out the most about school?", 
    type: 'text', 
    required: false,
    emoji: '😰',
    color: 'from-red-500 to-pink-500'
  },
]

export default function Onboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [phoneError, setPhoneError] = useState('')

  // Fields that should show suggestions
  const suggestionFields = ['field_of_study', 'university', 'extracurriculars', 'biggest_stress']

  // Check if phone number is valid (without setting state - for render checks)
  const isPhoneValid = (phone) => {
    if (!phone) return false
    const cleaned = phone.replace(/\D/g, '')
    return /^[6-9]\d{9}$/.test(cleaned)
  }

  // Validate Indian phone number and set error state (for event handlers)
  const validateIndianPhone = (phone) => {
    if (!phone) {
      setPhoneError('')
      return true
    }

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Only allow exactly 10 digits starting with 6-9
    const isValid = /^[6-9]\d{9}$/.test(cleaned)
    
    if (!isValid) {
      if (cleaned.length === 0) {
        setPhoneError('')
      } else if (cleaned.length < 10) {
        setPhoneError(`Enter ${10 - cleaned.length} more digit${10 - cleaned.length > 1 ? 's' : ''}`)
      } else if (cleaned.length > 10) {
        setPhoneError('Phone number must be exactly 10 digits')
      } else if (!/^[6-9]/.test(cleaned)) {
        setPhoneError('Indian mobile numbers must start with 6, 7, 8, or 9')
      } else {
        setPhoneError('Invalid phone number format')
      }
    } else {
      setPhoneError('')
    }

    return isValid
  }

  // Format phone number as user types - Strictly limit to 10 digits
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, '')
    
    // Limit to exactly 10 digits
    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10)
    }
    
    return cleaned
  }

  // Get suggestions from all users' data
  const getSuggestions = (fieldId, query) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem('zeni_users') || '[]')
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Get all unique values for this field from other users
      const allValues = users
        .filter(u => u.id !== currentUser.id && u[fieldId]) // Exclude current user
        .map(u => u[fieldId])
        .filter(Boolean)

      // Filter suggestions based on query (case-insensitive)
      const filtered = allValues
        .filter((value, index, self) => self.indexOf(value) === index) // Get unique values
        .filter(value => 
          value.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5) // Limit to 5 suggestions

      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } catch (error) {
      console.error('Error getting suggestions:', error)
      setSuggestions([])
    }
  }

  const handleAnswer = (value) => {
    const question = QUESTIONS[currentStep]
    setAnswers({ ...answers, [question.id]: value })
    setInputValue(value)
    
    // Get suggestions if this field supports them
    if (suggestionFields.includes(question.id)) {
      getSuggestions(question.id, value)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (value) => {
    const question = QUESTIONS[currentStep]
    
    // Format phone number if it's a phone field
    let formattedValue = value
    if (question.id === 'phone') {
      formattedValue = formatPhoneNumber(value)
      validateIndianPhone(formattedValue)
    }
    
    setInputValue(formattedValue)
    setAnswers({ ...answers, [question.id]: formattedValue })
    
    // Get suggestions if this field supports them
    if (suggestionFields.includes(question.id)) {
      getSuggestions(question.id, formattedValue)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion) => {
    const question = QUESTIONS[currentStep]
    setInputValue(suggestion)
    setAnswers({ ...answers, [question.id]: suggestion })
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setIsAnimating(true)
      setShowSuggestions(false)
      setInputValue('')
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
        // Set input value for next question
        const nextQuestion = QUESTIONS[currentStep + 1]
        if (nextQuestion && answers[nextQuestion.id]) {
          setInputValue(answers[nextQuestion.id])
        } else {
          setInputValue('')
        }
      }, 300)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    setIsAnimating(true)
    setShowSuggestions(false)
    setInputValue('')
    setTimeout(() => {
      setCurrentStep(Math.max(0, currentStep - 1))
      setIsAnimating(false)
      // Set input value for previous question
      const prevQuestion = QUESTIONS[Math.max(0, currentStep - 1)]
      if (prevQuestion && answers[prevQuestion.id]) {
        setInputValue(answers[prevQuestion.id])
      } else {
        setInputValue('')
      }
    }, 300)
  }

  // Update input value when step changes
  useEffect(() => {
    const currentQuestion = QUESTIONS[currentStep]
    if (currentQuestion && answers[currentQuestion.id]) {
      setInputValue(answers[currentQuestion.id])
      if (currentQuestion.id === 'phone') {
        validateIndianPhone(answers[currentQuestion.id])
      }
    } else {
      setInputValue('')
      setPhoneError('')
    }
    setShowSuggestions(false)
    setSuggestions([])
  }, [currentStep])

  const handleComplete = async () => {
    setLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Update user in localStorage with onboarding data
      const updatedUser = {
        ...user,
        ...answers,
        onboarding_complete: true
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Also update in users list
      const users = JSON.parse(localStorage.getItem('zeni_users') || '[]')
      const userIndex = users.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...answers, onboarding_complete: true }
        localStorage.setItem('zeni_users', JSON.stringify(users))
      }
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('Error saving your information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentQuestion = QUESTIONS[currentStep]
  const canProceed = currentQuestion.required 
    ? (currentQuestion.id === 'phone' 
        ? answers[currentQuestion.id] && !phoneError && isPhoneValid(answers[currentQuestion.id])
        : answers[currentQuestion.id])
    : true
  const progress = QUESTIONS.length > 1 ? (currentStep / (QUESTIONS.length - 1)) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`relative z-10 w-full max-w-3xl transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">{currentQuestion.emoji}</span>
              <span className="text-white/90 font-semibold">
                Question {currentStep + 1} of {QUESTIONS.length}
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-bold text-lg">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className={`bg-gradient-to-r ${currentQuestion.color} h-4 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className={`bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-white/70 transform transition-all duration-300 hover:shadow-3xl`}>
          {/* Question Header */}
          <div className={`mb-6 text-center`}>
            <div className="text-5xl mb-3 animate-pulse">{currentQuestion.emoji}</div>
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r ${currentQuestion.color} bg-clip-text text-transparent`}>
              {currentQuestion.question}
            </h2>
            <div className={`w-20 h-0.5 bg-gradient-to-r ${currentQuestion.color} mx-auto opacity-50 rounded-full`}></div>
          </div>

          {/* Input Section */}
          <div className="mb-8 min-h-[200px]">
            {currentQuestion.type === 'text' && (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={currentQuestion.id === 'phone' ? 'tel' : 'text'}
                    value={inputValue || answers[currentQuestion.id] || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setInputValue(value)
                      handleInputChange(value)
                    }}
                    onFocus={() => {
                      if (suggestionFields.includes(currentQuestion.id) && inputValue) {
                        getSuggestions(currentQuestion.id, inputValue)
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicking on them
                      setTimeout(() => setShowSuggestions(false), 200)
                    }}
                    className={`w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-opacity-50 focus:border-transparent text-base transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transform hover:scale-[1.01] focus:scale-[1.01] ${
                      currentQuestion.id === 'phone' ? 'focus:ring-blue-500' :
                      currentQuestion.id === 'field_of_study' ? 'focus:ring-blue-500' :
                      'focus:ring-purple-500'
                    }`}
                    placeholder={
                      currentQuestion.id === 'field_of_study' ? "e.g., Computer Science, Engineering, Business" :
                      currentQuestion.id === 'university' ? "e.g., CMR Institute of Technology, Hyderabad" :
                      currentQuestion.id === 'phone' ? "e.g., 9876543210 (10 digits only)" :
                      currentQuestion.id === 'extracurriculars' ? "e.g., Sports, Music, Debate Club" :
                      currentQuestion.id === 'wake_time' ? "e.g., 7:00 AM" :
                      currentQuestion.id === 'biggest_stress' ? "e.g., Exams, Assignments, Time management" :
                      "Enter your answer"
                    }
                    maxLength={currentQuestion.id === 'phone' ? 10 : undefined}
                    autoFocus
                    required={currentQuestion.required}
                  />
                  
                  {/* Phone validation error */}
                  {currentQuestion.id === 'phone' && phoneError && (
                    <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                      <span>⚠️</span>
                      <p>{phoneError}</p>
                    </div>
                  )}
                  
                  {/* Phone format hint */}
                  {currentQuestion.id === 'phone' && !phoneError && inputValue && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-xs">
                      <span>✓</span>
                      <p>Valid Indian phone number format</p>
                    </div>
                  )}
                  
                  {/* Suggestions Dropdown - Positioned at bottom */}
                  {showSuggestions && suggestions.length > 0 && suggestionFields.includes(currentQuestion.id) && (
                    <div className="absolute z-50 w-full top-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 max-h-60 overflow-y-auto">
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                          <span>💡</span>
                          Suggestions from other users
                        </p>
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSuggestion(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">✨</span>
                          <span className="flex-1 font-medium text-gray-700 group-hover:text-indigo-600">
                            {suggestion}
                          </span>
                          <span className="text-gray-400 group-hover:text-indigo-500">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {currentQuestion.required && !answers[currentQuestion.id] && (
                  <div className="flex items-center gap-2 text-red-500 animate-pulse">
                    <span>⚠️</span>
                    <p className="text-sm font-medium">This field is required</p>
                  </div>
                )}
              </div>
            )}

            {currentQuestion.type === 'number' && (
              <div className="space-y-4">
                <input
                  type="number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 focus:border-transparent text-base transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transform hover:scale-[1.01] focus:scale-[1.01]"
                  placeholder="e.g., 5"
                  min="1"
                  max="10"
                  autoFocus
                  required={currentQuestion.required}
                />
                {currentQuestion.required && !answers[currentQuestion.id] && (
                  <div className="flex items-center gap-2 text-red-500 animate-pulse">
                    <span>⚠️</span>
                    <p className="text-sm font-medium">This field is required</p>
                  </div>
                )}
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <span>💡</span>
                  Enter the number of classes you're taking this semester
                </p>
              </div>
            )}

            {currentQuestion.type === 'select' && (
              <div className="grid gap-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`group relative w-full text-left px-5 py-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.01] ${
                      answers[currentQuestion.id] === option
                        ? `bg-gradient-to-r ${currentQuestion.color} text-white border-transparent shadow-lg scale-105`
                        : 'bg-white/90 backdrop-blur-sm border-gray-300 hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <span className="text-base font-semibold relative z-10">{option}</span>
                    {answers[currentQuestion.id] === option && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl animate-bounce">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                currentStep === 0
                  ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
                  : 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md transform hover:scale-105 border-2 border-gray-300'
              }`}
            >
              <span>←</span>
              Back
            </button>
            
            <div className="flex gap-2">
              {QUESTIONS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? `w-8 bg-gradient-to-r ${currentQuestion.color}`
                      : index < currentStep
                      ? 'w-2 bg-green-400'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed || loading}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-300 flex items-center gap-2 shadow-md transform hover:scale-105 ${
                !canProceed || loading
                  ? 'opacity-50 cursor-not-allowed bg-gray-400'
                  : `bg-gradient-to-r ${currentQuestion.color} hover:shadow-lg`
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Saving...
                </>
              ) : currentStep === QUESTIONS.length - 1 ? (
                <>
                  Complete
                  <span className="text-2xl animate-bounce">🎉</span>
                </>
              ) : (
                <>
                  Next
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Fun Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm flex items-center justify-center gap-2">
            <span className="animate-pulse">✨</span>
            We're almost there! Just a few more questions
            <span className="animate-pulse">✨</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
