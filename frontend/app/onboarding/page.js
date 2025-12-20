'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  { id: 'field_of_study', question: "What are you studying?", type: 'text', required: true },
  { id: 'num_classes', question: "How many classes are you taking this semester?", type: 'number', required: true },
  { id: 'extracurriculars', question: "Do you have any clubs or activities outside of classes?", type: 'text', required: false },
  { id: 'wake_time', question: "What time do you usually wake up? (e.g., 8:00 AM)", type: 'text', required: false },
  { id: 'energy_pattern', question: "Are you a morning person or night owl?", type: 'select', options: ['Morning person', 'Night owl', 'Neither'], required: false },
  { id: 'biggest_stress', question: "What stresses you out the most about school?", type: 'text', required: false },
]

export default function Onboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)

  const handleAnswer = (value) => {
    const question = QUESTIONS[currentStep]
    setAnswers({ ...answers, [question.id]: value })
  }

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

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
    ? answers[currentQuestion.id] 
    : true

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-white/20">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {currentStep + 1} of {QUESTIONS.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">{currentQuestion.question}</h2>

          {currentQuestion.type === 'text' && (
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              placeholder="Type your answer..."
              autoFocus
            />
          )}

          {currentQuestion.type === 'number' && (
            <input
              type="number"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              placeholder="Enter a number..."
              min="0"
              autoFocus
            />
          )}

          {currentQuestion.type === 'select' && (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                    answers[currentQuestion.id] === option
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed || loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : currentStep === QUESTIONS.length - 1 ? 'Complete' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}

