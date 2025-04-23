import React, { useState, useEffect, use } from "react";
import { database } from "../../firebase";
import { get, ref } from "firebase/database";
import ReactMarkdown from 'react-markdown'
import { getAIfeedback } from "../../services/api";

const QuizResults = ({ quizId, currentUser, onExit, isTeacher }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzData = async () => {
      setIsLoading(true);
      const questionRef = ref(database, `quizzes/${quizId}/questions`);
      const questionSnapshot = await get(questionRef);
      const questionData = questionSnapshot.val() || {};
      const userAnswersRef = ref(
        database,
        `quizzes/${quizId}/answers/${currentUser.uid}`
      );
      const userAnswersSnapshot = await get(userAnswersRef);
      const userAnswersData = userAnswersSnapshot.val() || {};
      const questionsArray = Object.values(questionData);
      const userAnswersArray = Object.values(userAnswersData);
      setQuestions(questionsArray);
      setUserAnswers(userAnswersArray);
    };
    fetchQuizzData();
  }, [quizId, currentUser.uid]);

  useEffect(() => {
    if (questions.length > 0 && userAnswers.length > 0) {
      setIsLoading(false);
    }
  }, [questions, userAnswers]);

  const generateAiFeedback = async () => {
    setIsFeedbackLoading(true);
    try {
      const response = await getAIfeedback(questions, userAnswers , quizId);
      if (response) {
        setFeedback(response.feedback);
      } else {
        setFeedback("No feedback available.");
      }
      
    } catch (error) {
      console.error("Error generating AI feedback:", error);
      setFeedback("Error getting feedback")
      setTimeout(() => {
        setFeedback('')
      }, 5000)
    }finally {
      setIsFeedbackLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{"Quiz Results"}</h1>
          <p className="text-gray-600">Quiz ID: {quizId}</p>
        </div>

        {!isLoading && questions.length > 0 && (
          <div>
            {questions.map((question, index) => (
              <div
                key={question._id}
                className="bg-gray-50 p-4 rounded-md mb-4"
              >
                <p className="text-lg font-medium mb-3">
                  {question?.questionText}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {question?.options.map((option) => (
                    <div
                      key={option._id}
                      className={`p-3 rounded-md ${
                        option.isCorrect
                          ? "bg-green-100 border border-green-500"
                          : userAnswers[index].optionId === option._id &&
                            !userAnswers.isCorrect
                          ? "bg-white border-2 border-red-500"
                          : "bg-white border border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                            option.isCorrect
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option.text}</span>
                      </div>
                      {userAnswers[index].optionId === option._id && (
                        <span className="text-sm text-gray-500 ml-2">
                          Your answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="w-full mt-8">
          {feedback ? (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
              <h3 className="text-lg font-semibold mb-2">AI Feedback</h3>
              
                <ReactMarkdown >{feedback}</ReactMarkdown>
              
            </div>
          ) : (
            <button
              onClick={generateAiFeedback}
              disabled={isFeedbackLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                isFeedbackLoading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition duration-200`}
            >
              {isFeedbackLoading
                ? "Generating Feedback..."
                : "Generate AI Feedback"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
