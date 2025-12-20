'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const testimonialsRef = useRef(null)
  const [openFAQ, setOpenFAQ] = useState(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  // Auto-scroll testimonials horizontally
  useEffect(() => {
    const scrollContainer = testimonialsRef.current
    if (!scrollContainer) return

    let scrollPosition = 0
    const scrollSpeed = 0.5 // Slow scroll speed

    const scroll = () => {
      scrollPosition += scrollSpeed
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
      
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0 // Reset to start for infinite loop
      }
      
      scrollContainer.scrollLeft = scrollPosition
    }

    const interval = setInterval(scroll, 50) // Update every 50ms for smooth scrolling

    return () => clearInterval(interval)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white font-semibold">Loading ZENI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
             Welcome to <span className="text-yellow-300">ZENI</span>
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

        {/* About ZENI Section */}
        <div className="mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 border-2 border-white/30">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-white drop-shadow-lg">
              About ZENI
            </h2>
            <div className="space-y-6 text-white/90 text-lg leading-relaxed">
              <p className="text-center text-xl font-semibold text-white mb-4">
                Your AI-Powered Student Companion
              </p>
              <p>
                ZENI is more than just a productivity app—it's your empathetic AI companion designed specifically for students. 
                We understand that being a student isn't just about managing tasks and deadlines; it's about maintaining your 
                mental well-being while navigating the challenges of academic life.
              </p>
              <p>
                Unlike traditional productivity tools that treat you like a machine, ZENI recognizes that you're human. 
                We've built an AI that listens, understands, and adapts to your unique needs. Whether you're feeling overwhelmed 
                by assignments, stressed about exams, or just need someone to talk to, ZENI is here for you.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>🎯</span>
                    Our Mission
                  </h3>
                  <p className="text-white/90">
                    To empower students with intelligent organization tools while prioritizing their mental health and well-being. 
                    We believe every student deserves support that goes beyond task management.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span>💡</span>
                    Our Vision
                  </h3>
                  <p className="text-white/90">
                    A world where students can focus on learning and growing without the constant stress of organization and 
                    time management. ZENI handles the logistics so you can focus on what truly matters.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Why We Built ZENI</h3>
                <p className="text-white/90">
                  As students ourselves, we experienced firsthand the overwhelming pressure of managing coursework, deadlines, 
                  and personal life. Traditional productivity apps felt cold and impersonal. We wanted something different—an AI 
                  companion that truly understands the student experience, with empathy at its core.
                </p>
                <p className="text-white/90 mt-4">
                  ZENI is the result of that vision: an intelligent assistant that organizes your academic life automatically 
                  while being there for you emotionally. No complex setup, no judgment—just support when you need it most.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300 animate-fade-in">
            <div className="w-12 h-12 mb-4 text-4xl animate-bounce">📅</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Smart Organization</h3>
            <p className="text-white/90">
              Upload your syllabus and I'll organize everything automatically. No templates, no setup.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/30 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 mb-4 text-4xl animate-pulse">💬</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Empathetic Support</h3>
            <p className="text-white/90">
              I'm here to listen and support you, not judge. Talk to me anytime you're feeling stressed.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 mb-4 text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>❤️</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Mental Health First</h3>
            <p className="text-white/90">
              Your well-being matters. I help you manage stress and recognize when you need support.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300 animate-fade-in">
              <div className="text-4xl mb-4 animate-bounce">📚</div>
              <h3 className="text-lg font-bold mb-2 text-white">Syllabus Parser</h3>
              <p className="text-white/90 text-sm">Upload your syllabus and I'll extract all important dates and assignments automatically.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl mb-4 animate-pulse">⏰</div>
              <h3 className="text-lg font-bold mb-2 text-white">Smart Reminders</h3>
              <p className="text-white/90 text-sm">Never miss a deadline. I'll remind you at the perfect time.</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '0.3s' }}>🧠</div>
              <h3 className="text-lg font-bold mb-2 text-white">Mental Health Check-ins</h3>
              <p className="text-white/90 text-sm">Regular check-ins to monitor your stress levels and well-being.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl mb-4 animate-pulse" style={{ animationDelay: '0.4s' }}>📊</div>
              <h3 className="text-lg font-bold mb-2 text-white">Progress Tracking</h3>
              <p className="text-white/90 text-sm">Visualize your academic progress and productivity trends.</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '0.5s' }}>🎯</div>
              <h3 className="text-lg font-bold mb-2 text-white">Goal Setting</h3>
              <p className="text-white/90 text-sm">Set and track your academic and personal goals.</p>
            </div>
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl mb-4 animate-pulse" style={{ animationDelay: '0.6s' }}>📝</div>
              <h3 className="text-lg font-bold mb-2 text-white">Task Management</h3>
              <p className="text-white/90 text-sm">Organize all your tasks in one place with smart prioritization.</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '0.7s' }}>🗓️</div>
              <h3 className="text-lg font-bold mb-2 text-white">Calendar Integration</h3>
              <p className="text-white/90 text-sm">Sync with your existing calendar for seamless scheduling.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="text-4xl mb-4 animate-pulse" style={{ animationDelay: '0.8s' }}>💡</div>
              <h3 className="text-lg font-bold mb-2 text-white">Study Tips</h3>
              <p className="text-white/90 text-sm">Get personalized study tips based on your learning style.</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/30 transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">Benefits of Using ZENI</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl mb-4 animate-bounce">📈</div>
              <h3 className="text-xl font-bold mb-2 text-white">Better Grades</h3>
              <p className="text-white/90">Students using ZENI report improved academic performance and better time management.</p>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl mb-4 animate-pulse" style={{ animationDelay: '0.2s' }}>😌</div>
              <h3 className="text-xl font-bold mb-2 text-white">Less Stress</h3>
              <p className="text-white/90">Reduce mental overload with automated organization and empathetic support.</p>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl mb-4 animate-bounce" style={{ animationDelay: '0.4s' }}>⏱️</div>
              <h3 className="text-xl font-bold mb-2 text-white">Save Time</h3>
              <p className="text-white/90">Spend less time organizing and more time on what matters - learning and living.</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">What Students Say</h2>
          <div 
            ref={testimonialsRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ 
              scrollBehavior: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="flex-shrink-0 w-80 bg-gradient-to-br from-cyan-500 to-blue-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mr-3 animate-pulse">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Sarah M.</h4>
                  <p className="text-sm text-white/80">Computer Science Student</p>
                </div>
              </div>
              <p className="text-white/90 italic">"ZENI has completely transformed how I manage my coursework. I feel so much less stressed knowing everything is organized for me."</p>
            </div>
            <div className="flex-shrink-0 w-80 bg-gradient-to-br from-purple-500 to-indigo-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mr-3 animate-bounce">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Alex K.</h4>
                  <p className="text-sm text-white/80">Business Major</p>
                </div>
              </div>
              <p className="text-white/90 italic">"The mental health check-ins are a game-changer. ZENI actually cares about my well-being, not just my productivity."</p>
            </div>
            <div className="flex-shrink-0 w-80 bg-gradient-to-br from-pink-500 to-rose-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mr-3 animate-pulse">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Jordan T.</h4>
                  <p className="text-sm text-white/80">Engineering Student</p>
                </div>
              </div>
              <p className="text-white/90 italic">"I love how ZENI learns my patterns and adapts. It's like having a personal assistant who actually understands me."</p>
            </div>
            <div className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-500 to-cyan-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mr-3 animate-pulse">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Maya P.</h4>
                  <p className="text-sm text-white/80">Medical Student</p>
                </div>
              </div>
              <p className="text-white/90 italic">"As a medical student with a hectic schedule, ZENI has been a lifesaver. It keeps track of everything so I can focus on studying."</p>
            </div>
            <div className="flex-shrink-0 w-80 bg-gradient-to-br from-indigo-500 to-purple-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mr-3 animate-bounce">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Ryan L.</h4>
                  <p className="text-sm text-white/80">Psychology Major</p>
                </div>
              </div>
              <p className="text-white/90 italic">"The empathetic approach of ZENI is incredible. It feels like talking to a friend who genuinely cares about your success and well-being."</p>
            </div>
            <div className="flex-shrink-0 w-80 bg-gradient-to-br from-rose-500 to-pink-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mr-3 animate-pulse">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Priya S.</h4>
                  <p className="text-sm text-white/80">Data Science Student</p>
                </div>
              </div>
              <p className="text-white/90 italic">"ZENI's smart reminders are perfectly timed. I never miss deadlines anymore, and the stress reduction is noticeable."</p>
            </div>
            <div className="flex-shrink-0 w-80 bg-gradient-to-br from-cyan-500 to-blue-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mr-3 animate-bounce">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Chris D.</h4>
                  <p className="text-sm text-white/80">Art & Design Student</p>
                </div>
              </div>
              <p className="text-white/90 italic">"The best part about ZENI is how it adapts to my creative workflow. It doesn't force me into rigid structures."</p>
            </div>
            <div className="flex-shrink-0 w-80 bg-gradient-to-br from-purple-500 to-indigo-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mr-3 animate-pulse">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-white">Emma W.</h4>
                  <p className="text-sm text-white/80">Law Student</p>
                </div>
              </div>
              <p className="text-white/90 italic">"Managing multiple case studies and deadlines was overwhelming. ZENI organizes everything automatically - it's like magic!"</p>
            </div>
          </div>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <button
              onClick={() => setOpenFAQ(openFAQ === 0 ? null : 0)}
              className="bg-gradient-to-br from-cyan-500 to-blue-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 transition-all duration-300 text-left animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Is ZENI free to use?</h3>
                <span className={`text-2xl text-white transition-transform duration-300 ${openFAQ === 0 ? 'rotate-45' : ''}`}>
                  +
                </span>
              </div>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFAQ === 0 ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-white/90">Yes! ZENI is completely free for students. We believe mental health and organization tools should be accessible to everyone.</p>
              </div>
            </button>
            <button
              onClick={() => setOpenFAQ(openFAQ === 1 ? null : 1)}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 transition-all duration-300 text-left animate-fade-in" 
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">How does ZENI protect my privacy?</h3>
                <span className={`text-2xl text-white transition-transform duration-300 ${openFAQ === 1 ? 'rotate-45' : ''}`}>
                  +
                </span>
              </div>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFAQ === 1 ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-white/90">Your data is stored locally in your browser. We don't share your information with anyone. Your privacy is our priority.</p>
              </div>
            </button>
            <button
              onClick={() => setOpenFAQ(openFAQ === 2 ? null : 2)}
              className="bg-gradient-to-br from-pink-500 to-rose-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 transition-all duration-300 text-left animate-fade-in" 
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Can I use ZENI on my phone?</h3>
                <span className={`text-2xl text-white transition-transform duration-300 ${openFAQ === 2 ? 'rotate-45' : ''}`}>
                  +
                </span>
              </div>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFAQ === 2 ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-white/90">Absolutely! ZENI is fully responsive and works beautifully on desktop, tablet, and mobile devices.</p>
              </div>
            </button>
            <button
              onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}
              className="bg-gradient-to-br from-blue-500 to-cyan-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 transition-all duration-300 text-left animate-fade-in" 
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Do I need to connect any accounts?</h3>
                <span className={`text-2xl text-white transition-transform duration-300 ${openFAQ === 3 ? 'rotate-45' : ''}`}>
                  +
                </span>
              </div>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFAQ === 3 ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-white/90">No! ZENI works standalone. You can optionally connect your calendar later, but it's not required.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Our Team Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-4 text-white drop-shadow-lg">Meet Our Team</h2>
          <p className="text-center text-white/90 mb-12 text-lg drop-shadow-md">The passionate developers behind ZENI</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Sai Manaswini - Project Head */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300 text-center">
              <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                👩‍💼
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Sai Manaswini</h3>
              <p className="text-white/90 font-semibold mb-3">Project Head</p>
              <p className="text-white/80 text-sm mb-4">
                Leading the vision and strategy for ZENI. Passionate about creating solutions that make student life easier and more organized.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                <p className="text-white text-xs font-medium">CMR Institute of Technology</p>
                <p className="text-white/80 text-xs">Hyderabad</p>
              </div>
            </div>

            {/* Harshitha - Full Stack Developer */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 text-center">
              <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-bounce">
                👩‍💻
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Harshitha</h3>
              <p className="text-white/90 font-semibold mb-3">Full Stack Developer</p>
              <p className="text-white/80 text-sm mb-4">
                Building beautiful and functional interfaces. Expert in creating seamless user experiences from frontend to backend.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                <p className="text-white text-xs font-medium">CMR Institute of Technology</p>
                <p className="text-white/80 text-xs">Hyderabad</p>
              </div>
            </div>

            {/* Ankith - Backend Developer */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-white/30 transform hover:scale-105 hover:rotate-1 transition-all duration-300 text-center">
              <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-pulse" style={{ animationDelay: '0.2s' }}>
                👨‍💻
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Ankith</h3>
              <p className="text-white/90 font-semibold mb-3">Backend Developer</p>
              <p className="text-white/80 text-sm mb-4">
                Architecting robust and scalable systems. Ensuring ZENI's backend is reliable, secure, and performant.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                <p className="text-white text-xs font-medium">CMR Institute of Technology</p>
                <p className="text-white/80 text-xs">Hyderabad</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center pb-16">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 backdrop-blur-sm rounded-xl shadow-2xl p-12 border border-white/30 transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Ready to Transform Your Student Life?</h2>
            <p className="text-xl text-white/90 mb-8 drop-shadow-md">Join thousands of students who are already using ZENI to stay organized and stress-free.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/login')}
                className="bg-indigo-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Get Started Free
              </button>
              <button
                onClick={() => router.push('/login')}
                className="bg-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-lg text-lg font-semibold border-2 border-white/50 hover:bg-white/30 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/20 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* About ZENI */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">ZENI</h3>
              <p className="text-white/80 text-sm mb-4">
                Your AI student companion for better organization, productivity, and mental well-being.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => router.push('/login')}
                    className="text-white/80 hover:text-white text-sm transition"
                  >
                    Sign Up
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/login')}
                    className="text-white/80 hover:text-white text-sm transition"
                  >
                    Sign In
                  </button>
                </li>
                <li>
                  <a href="#features" className="text-white/80 hover:text-white text-sm transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-white/80 hover:text-white text-sm transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition flex items-center gap-2">
                    <span>📚</span>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition flex items-center gap-2">
                    <span>🔒</span>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition flex items-center gap-2">
                    <span>📄</span>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition flex items-center gap-2">
                    <span>📧</span>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition flex items-center gap-2">
                    <span>📖</span>
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition flex items-center gap-2">
                    <span>💬</span>
                    Community Forum
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition flex items-center gap-2">
                    <span>📝</span>
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition flex items-center gap-2">
                    <span>⭐</span>
                    Give Feedback
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white text-sm transition flex items-center gap-2"
                  >
                    <span>📘</span>
                    Facebook
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white text-sm transition flex items-center gap-2"
                  >
                    <span>🐦</span>
                    Twitter
                  </a>
                </li>
                <li>
                  <a 
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white text-sm transition flex items-center gap-2"
                  >
                    <span>📷</span>
                    Instagram
                  </a>
                </li>
                <li>
                  <a 
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white text-sm transition flex items-center gap-2"
                  >
                    <span>💼</span>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a 
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white text-sm transition flex items-center gap-2"
                  >
                    <span>📺</span>
                    YouTube
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white text-sm transition flex items-center gap-2"
                  >
                    <span>💻</span>
                    GitHub
                  </a>
                </li>
              </ul>
              <p className="text-white/60 text-xs mt-4">
                Connect with us on social media for updates and tips!
              </p>
            </div>
          </div>

          {/* Copyright & Legal */}
          <div className="border-t border-white/20 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-white/60 text-sm text-center md:text-left">
                <p>© {new Date().getFullYear()} ZENI. All rights reserved.</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
                <a href="#" className="text-white/60 hover:text-white transition">
                  Privacy Policy
                </a>
                <span className="text-white/40">•</span>
                <a href="#" className="text-white/60 hover:text-white transition">
                  Terms of Service
                </a>
                <span className="text-white/40">•</span>
                <a href="#" className="text-white/60 hover:text-white transition">
                  Cookie Policy
                </a>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-white/50 text-xs">
                Made with ❤️ for students worldwide
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

