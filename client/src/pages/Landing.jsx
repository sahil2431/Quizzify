import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [hoverFeature, setHoverFeature] = useState(null);

  const features = [
    {
      id: 1,
      title: 'AI-Generated Quizzes',
      description: 'Our advanced AI creates personalized quizzes tailored to your knowledge and learning goals.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Instant AI Feedback',
      description: 'Receive detailed explanations and personalized feedback on your answers in real-time.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Live Quizzing',
      description: 'Compete with friends or join public quiz rooms for an engaging, interactive experience.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white transition-all duration-300">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Quizzify</h1>
          <div className="space-x-4">
            <Link to="/login" className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors duration-200">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fadeIn">
            Master Any Subject with <span className="text-indigo-600">AI-Powered</span> Quizzes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-12 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            Learn faster and retain more with our intelligent quiz platform. Get personalized questions, instant feedback, and compete with others in real-time.
          </p>
          <div className="flex gap-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <Link to="/signup" className="px-8 py-3 bg-indigo-600 text-white rounded-md text-lg font-medium hover:bg-indigo-700 transition-all duration-200">
              Get Started Free
            </Link>
            <a href="#features" className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-md text-lg font-medium hover:bg-indigo-50 transition-all duration-200">
              Learn More
            </a>
          </div>
          
          {/* Hero Image */}
          <div className="mt-16 max-w-5xl w-full bg-white p-4 rounded-xl shadow-lg animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="w-full rounded-lg overflow-hidden">
              <img 
                src="/platform.png" 
                alt="Quizzify platform interface" 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4 animate-fadeIn">Intelligent Features</h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-16 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            Our platform combines advanced AI with engaging quizzing to create a unique learning experience.
          </p>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div 
                key={feature.id}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 animate-fadeIn"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
                onMouseEnter={() => setHoverFeature(feature.id)}
                onMouseLeave={() => setHoverFeature(null)}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-indigo-600 py-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 animate-fadeIn">Ready to Transform Your Learning?</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              Join thousands of learners who have improved their knowledge using our AI-powered quizzes.
            </p>
            <Link to="/signup" className="px-8 py-3 bg-white text-indigo-600 rounded-md text-lg font-medium hover:bg-indigo-50 transition-all duration-200 inline-block animate-fadeIn" style={{ animationDelay: '200ms' }}>
              Sign Up Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold text-indigo-600">Quizzify</h2>
              <p className="text-gray-500">Elevate your learning with AI</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">About</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">Terms</a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>© {new Date().getFullYear()} QuizAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 