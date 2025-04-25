import { get, increment, ref, set, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

const QuizQuestion = ({
  isAIQuiz,
  currentQuestionIndex,
  question,
  questionNumber,
  totalQuestions,
  durationPerQues,
  timeLeft,
  quizId,
  setTimeLeft,
}) => {
  const { currentUser, userProfile } = useAuth();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timeProgress, setTimeProgress] = useState(100); 
  const [isLoading, setIsLoading] = useState(false);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleNextQuestion = async() => {
    setIsLoading(true);
    if(selectedOption === null) {
      await update(ref(database , (`aiQuiz/${currentUser.uid}/${quizId}/answers/${currentQuestionIndex}`)) , {
        optionId : -1,
        isCorrect : false,
      })
    }

    if(currentQuestionIndex + 1 === totalQuestions) {
      await update(ref(database , (`aiQuiz/${currentUser.uid}/${quizId}`)) , {
        status : "completed"
      })

      return
    }
    await update(ref(database , (`aiQuiz/${currentUser.uid}/${quizId}`)) , {
      currentQuestionIndex : increment(1)
    })
    setSelectedOption(null)
    setIsTimedOut(false);
    setTimeLeft(30)
    setTimeout(() => {setIsLoading(false)}, 1000);
  } 
  const handleSelection = async (index) => {
    setSelectedOption(index);
    if(isAIQuiz) {
      await update(ref(database , `aiQuiz/${currentUser.uid}/${quizId}/answers/${currentQuestionIndex}`) , {
        optionId : question.options[index]._id,
        isCorrect : question.options[index].isCorrect,
      })
      await update(ref(database , `aiQuiz/${currentUser.uid}/${quizId}`) , {
        points : question.options[index].isCorrect ? increment(1) : increment(0)
      })
    }
    else {

      const questionRef = ref(
        database,
        `quizzes/${quizId}/questions/${currentQuestionIndex}`
      );
      const question = await get(questionRef);
      const questionData = question.val();
      console.log(questionData);
      const isCorrect = questionData.options[index].isCorrect;
      const optionId = questionData.options[index]._id;
  
      await set(
        ref(
          database,
          `quizzes/${quizId}/answers/${currentUser.uid}/${currentQuestionIndex}`
        ),
        {
          optionId: optionId,
          isCorrect: isCorrect,
        }
      );
  
      await update(
        ref(database, `quizzes/${quizId}/leaderboard/${currentUser.uid}`),
        {
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          points: isCorrect ? increment(1) : increment(0),
        }
      );
    }
  };

  useEffect(() => {
    console.log("QuizQuestion useEffect called: " , quizId)
    setSelectedOption(null);
    setIsTimedOut(false);
  }, [currentQuestionIndex]);

  useEffect(() =>{
    setTimeProgress((timeLeft / durationPerQues) * 100);
    if (timeLeft <= 0) {
      setIsTimedOut(true);  
    }

    const setAnswer = async() => {
      if(!isAIQuiz) {
        await update(ref(database , `quizzes/${quizId}/answers/${currentUser.uid}/${currentQuestionIndex}`),{
          optionId : -1,
          isCorrect : false,
        })
      }
    }

    if(selectedOption === null && timeLeft <= 0) {
      setAnswer()
    }

  } , [timeLeft, durationPerQues]);

  if (isLoading ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium text-gray-700">
          Loading next question...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="font-semibold">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-24 h-6 bg-gray-200 rounded-full overflow-hidden mr-2">
            <div
              className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
              style={{ width: `${timeProgress}%` }}
            ></div>
          </div>
          <span className={`font-bold ${timeLeft < 10 ? "text-red-600" : ""}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6">{question?.questionText}</h2>

        <div className="space-y-3">
          {question?.options.map((option, index) => (
            <button
              key={option?._id}
              className={`w-full p-4 text-left rounded-lg border transition ${
                selectedOption === index
                  ? "bg-blue-100 border-blue-500 ring-2 ring-blue-500"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => handleSelection(index)}
              disabled={selectedOption !== null || isTimedOut}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                    selectedOption === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
      {isAIQuiz && (
          <button
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${isTimedOut ||
              selectedOption !== null
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isTimedOut && selectedOption === null}
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex + 1 === totalQuestions ? "Finish Quiz" : "Next Question"}
          </button>
        )}

        {selectedOption !== null && (
          <div className="text-green-600 font-medium">Answer submitted</div>
        )}

        {isTimedOut && selectedOption === null && (
          <div className="text-red-600 font-medium">
            Time's up! You didn't select an answer.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
