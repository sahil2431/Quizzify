import React, { useState, useEffect, use } from "react";
import { database } from "../../firebase";
import { get, ref, set } from "firebase/database";
import ReactMarkdown from "react-markdown";
import { getAIfeedback } from "../../services/api";
import { data } from "react-router-dom";

const QuizResults = ({ quizId, currentUser, onExit, isTeacher, isAIQuiz }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchQuizzData = async () => {
      setIsLoading(true);
      let questionRef;
      let userAnswersRef;
      if (isAIQuiz) {
        questionRef = ref(
          database,
          `aiQuiz/${currentUser.uid}/${quizId}/questions`
        );
        userAnswersRef = ref(
          database,
          `aiQuiz/${currentUser.uid}/${quizId}/answers`
        );
        const scoreRef = ref(
          database,
          `aiQuiz/${currentUser.uid}/${quizId}/points`
        );
        const scoreSnapshot = await get(scoreRef);
        const scoreData = scoreSnapshot.val();
        console.log("scoreData", scoreData);
        setTotalScore(scoreData);
      } else {
        questionRef = ref(database, `quizzes/${quizId}/questions`);
        userAnswersRef = ref(
          database,
          `quizzes/${quizId}/answers/${currentUser.uid}`
        );
        const scoreRef = ref(
          database,
          `quizzes/${quizId}/leaderboard/${currentUser.uid}`
        );
        const scoreSnapshot = await get(scoreRef);
        const scoreData = scoreSnapshot.val();
        setTotalScore(scoreData.points);
      }
      const questionSnapshot = await get(questionRef);
      const questionData = questionSnapshot.val() || {};
      const userAnswersSnapshot = await get(userAnswersRef);
      const userAnswersData = userAnswersSnapshot.val() || {};
      const questionsArray = Object.values(questionData);
      let userAnswersArray = Object.values(userAnswersData);
      console.log("questionsArray", questionsArray);
      console.log("userAnswersArray", userAnswersArray);
      if (questionsArray.length !== userAnswersArray.length) {
        const missingAnswersCount =
          questionsArray.length - userAnswersArray.length;
        let placeholderAnswers = [];

        for (let i = 0; i < missingAnswersCount; i++) {
          placeholderAnswers.push({
            optionId: -1,
            isCorrect: false,
          });
        }
        userAnswersArray = [...placeholderAnswers, ...userAnswersArray];
      }

      setQuestions(questionsArray);
      setUserAnswers(userAnswersArray);
    };
    fetchQuizzData();
  }, [quizId, currentUser.uid]);

  useEffect(() => {
    if (questions.length > 0 && userAnswers.length > 0) {
      if (userAnswers.length !== questions.length) {
      }
      setIsLoading(false);
    }
  }, [questions, userAnswers]);

  const generateAiFeedback = async () => {
    setIsFeedbackLoading(true);
    try {
      const response = await getAIfeedback(questions, userAnswers, quizId);
      if (response) {
        setFeedback(response.feedback);
      } else {
        setFeedback("No feedback available.");
      }
    } catch (error) {
      console.error("Error generating AI feedback:", error);
      setFeedback("Error getting feedback");
      setTimeout(() => {
        setFeedback("");
      }, 5000);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{"Quiz Results"}</h1>
          <p className="text-gray-600">Quiz ID: {quizId}</p>
          <p className="text-gray-600">Score : {totalScore}</p>
        </div>

        {!isLoading && questions.length > 0 && (
          <div>
            {questions.map((question, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium mb-3">Q {index + 1}:</p>
                  <p className="text-lg font-medium mb-3">
                    {question?.questionText}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {question?.options.map((option, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-md ${
                        option.isCorrect
                          ? "bg-green-100 border border-green-500"
                          : userAnswers[index]?.optionId === option?._id &&
                            !userAnswers?.isCorrect
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
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span>{option?.text}</span>
                      </div>
                      {userAnswers[index]?.optionId === option._id && (
                        <span className="text-sm text-gray-500 ml-2">
                          Your answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {!userAnswers[index] ||
                  (userAnswers[index]?.optionId === -1 && (
                    <span className="text-sm text-gray-500 ml-2">
                      You did not answer this question
                    </span>
                  ))}
              </div>
            ))}
          </div>
        )}

        <div className="w-full mt-8">
          {feedback ? (
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
              <h3 className="text-lg font-semibold mb-2">AI Feedback</h3>

              <ReactMarkdown>{feedback}</ReactMarkdown>
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
