import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const JoinQuizz = () => {
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [showFullscreenConfirmation, setShowFullscreenConfirmation] =
    useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [aiQuizParams, setAiQuizParams] = useState({
    topic: "",
    difficulty: "medium",
    numQuestions: 10,
  });

  const { userProfile } = useAuth();

  const navigate = useNavigate();

  const handleJoinQuizSubmit = (e) => {
    e.preventDefault();
    setPendingNavigation(`/quiz/${joinCode}`);
    setShowJoinPopup(false);
    setShowFullscreenConfirmation(true);
  };

  const handleAIQuizSubmit = (e) => {
    e.preventDefault();
    setPendingNavigation({
      path: "/quiz/ai",
      state: { ...aiQuizParams },
    });
    setShowAIPopup(false);
    setShowFullscreenConfirmation(true);
  };

  const closeAllPopups = () => {
    setShowJoinPopup(false);
    setShowAIPopup(false);
    setShowFullscreenConfirmation(false);
    setPendingNavigation(null);
  };

  const confirmFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      // After fullscreen is activated, navigate to the quiz
      if (typeof pendingNavigation === "string") {
        navigate(pendingNavigation);
      } else if (pendingNavigation && pendingNavigation.path) {
        navigate(pendingNavigation.path, {
          state: pendingNavigation.state,
        });
      }
    } catch (error) {
      console.error("Error entering fullscreen mode:", error);
      alert(
        "Failed to enter fullscreen mode. Please try again or enable permissions."
      );
    } finally {
      setShowFullscreenConfirmation(false);
      setPendingNavigation(null);
    }
  };

  useEffect(() => {
    if (userProfile && userProfile.role !== "student") {
      alert("You are not authorized to access this page.");
      navigate("/dashboard");
    }
  }, [userProfile, navigate]);

  if (!userProfile || userProfile.role !== "student") {
    return null; // Return nothing while redirecting
  }

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
          <p className="text-gray-600">
            Enter a quiz code provided by your teacher to join an existing quiz.
          </p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setShowAIPopup(true)}
        >
          <h2 className="text-xl font-semibold mb-3">AI Generated Quiz</h2>
          <p className="text-gray-600">
            Generate a quiz with AI based on your preferences and test your
            knowledge.
          </p>
        </div>
      </div>

      {showJoinPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl mx-auto my-auto">
            <h2 className="text-xl font-bold mb-4">Join Quiz</h2>
            <form onSubmit={handleJoinQuizSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="quizCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  value={aiQuizParams.topic}
                  onChange={(e) =>
                    setAiQuizParams({ ...aiQuizParams, topic: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Algebra, Quantum Physics, World War II"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Difficulty
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value="easy"
                      checked={aiQuizParams.difficulty === "easy"}
                      onChange={() =>
                        setAiQuizParams({ ...aiQuizParams, difficulty: "easy" })
                      }
                      className="mr-2"
                    />
                    Easy
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value="medium"
                      checked={aiQuizParams.difficulty === "medium"}
                      onChange={() =>
                        setAiQuizParams({
                          ...aiQuizParams,
                          difficulty: "medium",
                        })
                      }
                      className="mr-2"
                    />
                    Medium
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value="hard"
                      checked={aiQuizParams.difficulty === "hard"}
                      onChange={() =>
                        setAiQuizParams({ ...aiQuizParams, difficulty: "hard" })
                      }
                      className="mr-2"
                    />
                    Hard
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="numQuestions"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of Questions
                </label>
                <input
                  type="number"
                  id="numQuestions"
                  min="1"
                  max="50"
                  value={aiQuizParams.numQuestions}
                  onChange={(e) =>
                    setAiQuizParams({
                      ...aiQuizParams,
                      numQuestions: parseInt(e.target.value),
                    })
                  }
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

      {showFullscreenConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl mx-auto my-auto">
            <h2 className="text-xl font-bold mb-4">Quiz Mode</h2>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                This quiz requires full-screen mode to prevent cheating and
                provide the best experience.
              </p>
              <p className="text-gray-700 mb-2">
                By continuing, your screen will switch to full-screen mode.
              </p>
              <p className="text-sm text-red-600">
                Note: Exiting full-screen mode during the quiz may result in
                your answers being invalidated.
              </p>
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
                type="button"
                onClick={confirmFullscreen}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue in Full Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinQuizz;
