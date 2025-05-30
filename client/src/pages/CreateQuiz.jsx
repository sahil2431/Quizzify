import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { genrateQuiz, saveQuiz } from '../services/api';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const {userProfile } = useAuth();
  const [quizType, setQuizType] = useState('manual'); // 'manual' or 'ai'
  const [quizData, setQuizData] = useState({
    title: '',
    startTime: '',
    durationPerQuestion: 30,
    numberOfQuest: 10,
    questions: []
  });

  // For manual questions
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  });

  // For AI quiz
  const [aiQuizParams, setAiQuizParams] = useState({
    topic: '',
    difficulty: 'medium',
    numQuestions: 10
  });

  const handleQuizTypeChange = (type) => {
    setQuizType(type);
    setQuizData({
      title: '',
      startTime: '',
      durationPerQuest: 30,
      numberOfQuest: 10,
      questions: []
    });
  };

  const handleQuizDataChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: name === 'numberOfQuest' || name === 'durationPerQuestion' ? parseInt(value, 10) : value
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const handleAddQuestion = () => {
    if (currentQuestion.questionText && currentQuestion.options.length === 4 && currentQuestion.options.every(opt => opt.text) && currentQuestion.options.some(opt => opt.isCorrect)) {
      setQuizData(prev => ({
        ...prev,
        questions: [...prev.questions, currentQuestion]
      }));
      setCurrentQuestion({
        questionText: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      });
    }
  };

  const handleGenerateAIQuiz = async () => {
    try {
      const response = await genrateQuiz({
        topic: aiQuizParams.topic,
        numberOfQuestions: aiQuizParams.numQuestions,
        difficulty: aiQuizParams.difficulty
      });
      
      if (response.status) {
        setQuizData(prev => ({
          ...prev,
          questions: response.quizData
        }));
      }
    } catch (error) {
      console.error('Error generating AI quiz:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("quizData", quizData)
    console.log(quizData.questions.length, quizData.numberOfQuest)
    if(quizData.questions.length !== quizData.numberOfQuest) {
      alert(`Please add ${quizData.numberOfQuest - quizData.questions.length} more questions to continue`);
      return;
    }
    try {
      const response = await saveQuiz({
        ...quizData, })
      if (response.status) {
        alert('Quiz created successfully!');
      
      }
    } catch (error) {
      console.error('Error creating quiz:', error);

      
    }
  };

  useEffect(() => {
          if (userProfile && userProfile.role !== "teacher") {
              alert("You are not authorized to access this page.");
              navigate("/dashboard");
          }
      }, [userProfile, navigate]);
  
      if (!userProfile || userProfile.role !== "teacher") {
          return null; // Return nothing while redirecting
      }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Quiz</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              quizType === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleQuizTypeChange('manual')}
          >
            Manual Questions
          </button>
          <button
            className={`px-4 py-2 rounded ${
              quizType === 'ai' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleQuizTypeChange('ai')}
          >
            AI Generated Questions
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quiz Title</label>
            <input
              type="text"
              name="title"
              value={quizData.title}
              onChange={handleQuizDataChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={quizData.startTime}
              onChange={handleQuizDataChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration per Question (seconds)</label>
            <input
              type="number"
              name="durationPerQuest"
              value={quizData.durationPerQuest}
              onChange={handleQuizDataChange}
              min="10"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Questions</label>
            <input
              type="number"
              name="numberOfQuest"
              value={quizData.numberOfQuest}
              onChange={handleQuizDataChange}
              min="1"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {quizType === 'manual' ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add Questions</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Question Text</label>
                <textarea
                  name="questionText"
                  value={currentQuestion.questionText}
                  onChange={handleQuestionChange}
                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Options</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                      className="flex-1 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Correct</span>
                    </label>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Question
              </button>
            </div>

            <div className="mt-4">
  <h3 className="text-lg font-medium">Added Questions ({quizData.questions.length})</h3>
  <div className="mt-2 space-y-4">
    {quizData.questions.map((question, index) => (
      <div key={index} className="p-4 bg-gray-50 rounded">
        <div className="flex justify-between items-start">
          <p className="font-medium">{question.questionText}</p>
          <button
            type="button"
            onClick={() => {
              setQuizData(prev => ({
                ...prev,
                questions: prev.questions.filter((_, i) => i !== index)
              }));
            }}
            className="ml-2 px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
        <div className="mt-2 space-y-1">
          {question.options.map((option, optIndex) => (
            <p key={optIndex} className={`text-sm ${option.isCorrect ? 'text-green-600' : ''}`}>
              {option.text} {option.isCorrect ? '(Correct)' : ''}
            </p>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">AI Quiz Generation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Topic</label>
                <input
                  type="text"
                  value={aiQuizParams.topic}
                  onChange={(e) => setAiQuizParams(prev => ({ ...prev, topic: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                <select
                  value={aiQuizParams.difficulty}
                  onChange={(e) => setAiQuizParams(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateAIQuiz}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Generate Questions
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz; 