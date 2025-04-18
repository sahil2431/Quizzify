import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserQuizzes, getQuizByCode } from '../services/api';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      console.log('Fetching quizzes...');
      try {
        setLoading(true);
        const response = await getUserQuizzes();
        if (response.status) {
          setQuizzes(response.quizzes || []);
        } else {
          setError('Failed to fetch quizzes');
        }
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('An error occurred while fetching quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = async (accessCode) => {
    navigate(`/quiz/${accessCode}`)
  };

  const handleJoinQuiz = async (accessCode) => {
    try {
      const response = await getQuizByCode(accessCode);
      if (response.status) {
        navigate(`/quiz/${accessCode}`);
      } else {
        setError(response.message || 'Failed to join quiz');
      }
    } catch (err) {
      console.error('Error joining quiz:', err);
      setError('An error occurred while joining the quiz');
    }
  };

  const isTeacher = userProfile?.role === 'teacher';

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">My Quizzes</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            {isTeacher 
              ? "You haven't created any quizzes yet. Create your first quiz to get started!" 
              : "You haven't taken any quizzes yet. Join a quiz to get started!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div 
              key={quiz._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{quiz.title}</h3>
                <p className="text-gray-600 mb-4">{quiz.description || 'No description'}</p>
                
                <div className="flex items-center mb-4">
                  <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded 
                    ${quiz.status === 'not started' ? 'bg-gray-100 text-gray-800' : 
                    quiz.status === 'started' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'}">
                    {quiz.status === 'not started' ? 'Not Started' : 
                     quiz.status === 'started' ? 'In Progress' : 'Completed'}
                  </span>
                  
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 ml-2">
                    {quiz.questions.length} questions
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{quiz.durationPerQuestion} seconds per question</span>
                </div>
                
                {isTeacher ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {quiz.status === 'not started' && (
                      <button
                        onClick={() => handleStartQuiz(quiz.accessCode)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Start Quiz
                      </button>
                    )}
                    <button
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      onClick={() => navigator.clipboard.writeText(quiz.accessCode)}
                    >
                      Copy Code: {quiz.accessCode}
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    {quiz.status === 'completed' && (
                      <button
                        onClick={() => handleJoinQuiz(quiz.accessCode)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        View Results
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuizzes; 