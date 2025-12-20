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
        <div className="grid md:grid-cols-3 gap-8 mt-20">
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
        <div className="mt-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-white/30">
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
                <h4 className="font-semibold mb-1 text-gray-800">Fully Automated</h4>
                <p className="text-gray-700">I learn your patterns and adapt to help you better.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1 text-gray-800">Empathetic AI</h4>
                <p className="text-gray-700">I understand you're human, not a productivity machine.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1 text-xl">✓</span>
              <div>
                <h4 className="font-semibold mb-1 text-gray-800">Student-Focused</h4>
                <p className="text-gray-700">Built specifically for students, by understanding student needs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Sign Up</h3>
              <p className="text-gray-700">Create your account in seconds. No credit card required.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Tell Me About You</h3>
              <p className="text-gray-700">Quick onboarding to understand your schedule and preferences.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Start Organizing</h3>
              <p className="text-gray-700">I'll help you manage tasks, schedules, and your mental well-being.</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Syllabus Parser</h3>
              <p className="text-gray-700 text-sm">Upload your syllabus and I'll extract all important dates and assignments automatically.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Smart Reminders</h3>
              <p className="text-gray-700 text-sm">Never miss a deadline. I'll remind you at the perfect time.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Mental Health Check-ins</h3>
              <p className="text-gray-700 text-sm">Regular check-ins to monitor your stress levels and well-being.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Progress Tracking</h3>
              <p className="text-gray-700 text-sm">Visualize your academic progress and productivity trends.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Goal Setting</h3>
              <p className="text-gray-700 text-sm">Set and track your academic and personal goals.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Task Management</h3>
              <p className="text-gray-700 text-sm">Organize all your tasks in one place with smart prioritization.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="text-4xl mb-4">🗓️</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Calendar Integration</h3>
              <p className="text-gray-700 text-sm">Sync with your existing calendar for seamless scheduling.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Study Tips</h3>
              <p className="text-gray-700 text-sm">Get personalized study tips based on your learning style.</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">What Students Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Sarah M.</h4>
                  <p className="text-sm text-gray-600">Computer Science Student</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"ZENI has completely transformed how I manage my coursework. I feel so much less stressed knowing everything is organized for me."</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Alex K.</h4>
                  <p className="text-sm text-gray-600">Business Major</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"The mental health check-ins are a game-changer. ZENI actually cares about my well-being, not just my productivity."</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Jordan T.</h4>
                  <p className="text-sm text-gray-600">Engineering Student</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"I love how ZENI learns my patterns and adapts. It's like having a personal assistant who actually understands me."</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-white/30">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Benefits of Using ZENI</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Better Grades</h3>
              <p className="text-gray-700">Students using ZENI report improved academic performance and better time management.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">😌</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Less Stress</h3>
              <p className="text-gray-700">Reduce mental overload with automated organization and empathetic support.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Save Time</h3>
              <p className="text-gray-700">Spend less time organizing and more time on what matters - learning and living.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <h3 className="text-lg font-bold mb-2 text-gray-800">Is ZENI free to use?</h3>
              <p className="text-gray-700">Yes! ZENI is completely free for students. We believe mental health and organization tools should be accessible to everyone.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <h3 className="text-lg font-bold mb-2 text-gray-800">How does ZENI protect my privacy?</h3>
              <p className="text-gray-700">Your data is stored locally in your browser. We don't share your information with anyone. Your privacy is our priority.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <h3 className="text-lg font-bold mb-2 text-gray-800">Can I use ZENI on my phone?</h3>
              <p className="text-gray-700">Absolutely! ZENI is fully responsive and works beautifully on desktop, tablet, and mobile devices.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/30">
              <h3 className="text-lg font-bold mb-2 text-gray-800">Do I need to connect any accounts?</h3>
              <p className="text-gray-700">No! ZENI works standalone. You can optionally connect your calendar later, but it's not required.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center pb-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-12 border border-white/30">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Ready to Transform Your Student Life?</h2>
            <p className="text-xl text-gray-700 mb-8">Join thousands of students who are already using ZENI to stay organized and stress-free.</p>
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
                  <a href="#" className="text-white/80 hover:text-white text-sm transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white text-sm transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex gap-4 mb-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <span className="text-lg">📘</span>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <span className="text-lg">🐦</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <span className="text-lg">📷</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <span className="text-lg">💼</span>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition transform hover:scale-110"
                  aria-label="YouTube"
                >
                  <span className="text-lg">📺</span>
                </a>
              </div>
              <p className="text-white/60 text-xs">
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

