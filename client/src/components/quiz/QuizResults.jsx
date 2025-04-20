import React, { useState, useEffect, use } from "react";
import { database } from "../../firebase";
import { get, ref } from "firebase/database";
import Leaderboard from "./Leaderboard";

const QuizResults = ({ quizId, currentUser, onExit, isTeacher }) => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      
      <div className="flex flex-col justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            { "Quiz Results"}
          </h1>
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
                          : userAnswers[index].optionId === option._id && !userAnswers.isCorrect ? "bg-white border-2 border-red-500" : "bg-white border border-gray-300"
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
      </div>
    </div>
  );
};

export default QuizResults;
