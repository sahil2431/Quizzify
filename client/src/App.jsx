import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import Sidebar from './components/Sidebar';
import RoleSelection from './components/RoleSelection';
import './App.css';
import { useState } from 'react';
import {
  Dashboard,
  Login,
  Signup,
  AccountDetails,
  Landing,
  JoinQuizz
} from "./pages/index.js"

// Layout component for authenticated pages with Sidebar
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Navbar />
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// Layout component for quiz pages without Sidebar
const QuizLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

function AppRoutes() {
  const location = useLocation();
  
  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          } 
        />
        {/* Add routes for account details */}
        <Route 
          path="/account" 
          element={
            <PrivateRoute>
              <DashboardLayout>
                <AccountDetails/>
              </DashboardLayout>
            </PrivateRoute>
          } 
        />
        
        {/* Student routes */}
        <Route 
          path="/join-quizz" 
          element={
            <PrivateRoute>
              <DashboardLayout>
                <JoinQuizz/>
              </DashboardLayout>
            </PrivateRoute>
          } 
        />
        {/* Quiz routes */}
        <Route 
          path="/quiz/:quizId" 
          element={
            <PrivateRoute>
              <QuizLayout>
                <div className="animate-fadeIn">
                  <h1 className="text-2xl font-bold mb-4">Quiz</h1>
                  {/* Quiz content will be implemented in a separate component */}
                  <p>Quiz loaded with ID: Use useParams() to access</p>
                  <div className="mt-8 flex justify-between">
                    <button 
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      onClick={() => window.history.back()}
                    >
                      Exit Quiz
                    </button>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Submit Quiz
                    </button>
                  </div>
                </div>
              </QuizLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/quiz/ai" 
          element={
            <PrivateRoute>
              <QuizLayout>
                <div className="animate-fadeIn">
                  <h1 className="text-2xl font-bold mb-4">AI Generated Quiz</h1>
                  {/* AI Quiz content will be implemented in a separate component */}
                  <p>AI Quiz loaded. Use useLocation().state to access parameters</p>
                  <div className="mt-8 flex justify-between">
                    <button 
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      onClick={() => window.history.back()}
                    >
                      Exit Quiz
                    </button>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Submit Quiz
                    </button>
                  </div>
                </div>
              </QuizLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/given-quizzes" 
          element={
            <PrivateRoute>
              <DashboardLayout>
                <div className="animate-fadeIn">
                  <h1 className="text-2xl font-bold mb-4">Given Quizzes</h1>
                  {/* Content to be added */}
                </div>
              </DashboardLayout>
            </PrivateRoute>
          } 
        />
        
        {/* Teacher routes */}
        <Route 
          path="/host-quiz" 
          element={
            <PrivateRoute>
              <DashboardLayout>
                <div className="animate-fadeIn">
                  <h1 className="text-2xl font-bold mb-4">Host New Quiz</h1>
                  {/* Content to be added */}
                </div>
              </DashboardLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/my-quizzes" 
          element={
            <PrivateRoute>
              <DashboardLayout>
                <div className="animate-fadeIn">
                  <h1 className="text-2xl font-bold mb-4">My Quizzes</h1>
                  {/* Content to be added */}
                </div>
              </DashboardLayout>
            </PrivateRoute>
          } 
        />
        
        <Route path="/" element={<Landing />} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
