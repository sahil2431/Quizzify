import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinQuizz = () => {
    const [showJoinPopup, setShowJoinPopup] = useState(false);
    const [showAIPopup, setShowAIPopup] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [aiQuizParams, setAiQuizParams] = useState({
        subject: "",
        course: "",
        difficulty: 5,
        numQuestions: 10
    });
    
    const navigate = useNavigate();

    const handleJoinQuizSubmit = (e) => {
        e.preventDefault();
        navigate(`/quiz/${joinCode}`);
    };

    const handleAIQuizSubmit = (e) => {
        e.preventDefault();
        navigate('/quiz/ai', { 
            state: { 
                ...aiQuizParams 
            }
        });
    };

    const closeAllPopups = () => {
        setShowJoinPopup(false);
        setShowAIPopup(false);
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-2xl font-bold mb-6">Join Quiz</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Join Quiz by Code Option */}
                <div 
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setShowJoinPopup(true)}
                >
                    <h2 className="text-xl font-semibold mb-3">Join Quiz by Code</h2>
                    <p className="text-gray-600">Enter a quiz code provided by your teacher to join an existing quiz.</p>
                </div>
                
                <div 
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setShowAIPopup(true)}
                >
                    <h2 className="text-xl font-semibold mb-3">AI Generated Quiz</h2>
                    <p className="text-gray-600">Generate a quiz with AI based on your preferences and test your knowledge.</p>
                </div>
            </div>

            {showJoinPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl mx-auto my-auto">
                        <h2 className="text-xl font-bold mb-4">Join Quiz</h2>
                        <form onSubmit={handleJoinQuizSubmit}>
                            <div className="mb-4">
                                <label htmlFor="quizCode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Quiz Code
                                </label>
                                <input
                                    type="text"
                                    id="quizCode"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter quiz code"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeAllPopups}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Join Quiz
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* AI Quiz Popup */}
            {showAIPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl mx-auto my-auto">
                        <h2 className="text-xl font-bold mb-4">AI Generated Quiz</h2>
                        <form onSubmit={handleAIQuizSubmit}>
                            <div className="mb-4">
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={aiQuizParams.subject}
                                    onChange={(e) => setAiQuizParams({...aiQuizParams, subject: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Mathematics, Physics, History"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                                    Course
                                </label>
                                <input
                                    type="text"
                                    id="course"
                                    value={aiQuizParams.course}
                                    onChange={(e) => setAiQuizParams({...aiQuizParams, course: e.target.value})}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Algebra, Quantum Physics, World War II"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                                    Difficulty (1-10)
                                </label>
                                <input
                                    type="range"
                                    id="difficulty"
                                    min="1"
                                    max="10"
                                    value={aiQuizParams.difficulty}
                                    onChange={(e) => setAiQuizParams({...aiQuizParams, difficulty: parseInt(e.target.value)})}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Easy</span>
                                    <span>Current: {aiQuizParams.difficulty}</span>
                                    <span>Hard</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Questions
                                </label>
                                <input
                                    type="number"
                                    id="numQuestions"
                                    min="1"
                                    max="50"
                                    value={aiQuizParams.numQuestions}
                                    onChange={(e) => setAiQuizParams({...aiQuizParams, numQuestions: parseInt(e.target.value)})}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeAllPopups}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Generate Quiz
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinQuizz;