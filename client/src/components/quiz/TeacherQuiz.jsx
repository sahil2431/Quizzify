import React, { useEffect, useState , useRef } from "react";
import { useNavigate } from "react-router-dom";
import { get, increment, ref, set, update } from "firebase/database";
import { database } from "../../firebase";

const TeacherQuiz = ({ quiz, quizId, quizStatus , durationPerQues }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz?.durationPerQuestion || 30);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [timeProgress, setTimeProgress] = useState(100);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [participants, setParticipants] = useState({});
  const navigate = useNavigate();
  // Start quiz handler for teachers
  const handleStartQuiz = () => {
    if (quizStatus === "waiting") {
      const quizRef = ref(database, `quizzes/${quizId}`);
      update(quizRef, {
        status: "active",
        currentQuestion: {
          index: 0,
          timeLeft: 30,
          timer: Date.now() + 30000, // 30 seconds from now
        },
        startedAt: Date.now(),
      });
    }
  };

  // Show leaderboard handler for teachers
  const handleShowLeaderboard = () => {
    const leaderboardRef = ref(database, `quizzes/${quizId}/leaderboard`);
    update(leaderboardRef, {
      showLeaderboard: true,
    });
    setShowLeaderboard(true);
  };

  // Next question handler for teachers
  const handleNextQuestion = async () => {
    const quizRef = ref(database, `quizzes/${quizId}`);
    const quizSnapshot = await get(quizRef);
    const quizData = quizSnapshot.val();
    if (quizData) {
      console.log(quizData);
      if (quizData.currentQuestionIndex < quizData.questions.length - 1) {
        console.log(durationPerQues)
        await set(ref(database, `quizzes/${quizId}/timeLeftCurrQues`), durationPerQues);
        await update(ref(database , `quizzes/${quizId}`), {
          currentQuestionIndex: increment(1),
        });
        await update(ref(database, `quizzes/${quizId}/leaderboard`), {
          showLeaderboard: false,
        });
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }
  };

  // Exit quiz handler
  const handleExitQuiz = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      console.log(quizId);
      const quizRef = ref(database, `quizzes/${quizId}`);
      const quizSnapshot = await get(quizRef);
      const quizData = quizSnapshot.val();
      if (quizData) {
        setCurrentQuestionIndex(quizData.currentQuestionIndex || 0);
        setShowLeaderboard(quizData.leaderboard.showLeaderboard || false);
        setCurrentQuestion(quizData.questions[quizData.currentQuestionIndex]);
        const players = Object.entries(quizData.leaderboard || {})
          .filter(([key]) => key !== "showLeaderboard")
          .map(([userId, data]) => ({
            userId,
            ...data,
          }));
        setParticipants(players);
      }
    };

    fetchQuizData();
  }, [currentQuestionIndex, quizId]);

  useEffect(() => {
    setIsTimedOut(false);
    const timeLeftRef = { current: timeLeft };

    const timer = setInterval(async () => {
      const currentTime = timeLeftRef.current;
      const newTimeLeft = currentTime > 0 ? currentTime - 1 : 0;
      
      setTimeLeft(newTimeLeft);
      timeLeftRef.current = newTimeLeft;

      if (newTimeLeft <= 0) {
        setIsTimedOut(true);
        clearInterval(timer);
        setTimeLeft(durationPerQues)
      }

      await set(
        ref(database, `quizzes/${quizId}/timeLeftCurrQues`),
        newTimeLeft
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  useEffect(() => {
    setTimeProgress((timeLeft / quiz?.durationPerQuestion) * 100);
  }, [timeLeft]);

  if (quizStatus === "waiting") {
    // Teacher waiting room with controls
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{quiz?.title || "Quiz"}</h1>
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-2">
              Code: {quizId}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Quiz Controls</h2>
          <p className="text-gray-600 mb-4">{quiz?.description}</p>
          <button
            onClick={handleStartQuiz}
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
          >
            Start Quiz
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Participants ({Object.keys(participants).length})
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {Object.entries(participants).length === 0 ? (
              <p className="text-gray-500 text-center">No participants yet</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.values(participants).map((player, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-md shadow-sm flex items-center"
                  >
                    {player.photoURL ? (
                      <img
                        src={player.photoURL}
                        alt={player.displayName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                        {player.displayName?.charAt(0).toUpperCase() || "A"}
                      </div>
                    )}
                    <span className="truncate">{player.displayName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleExitQuiz}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  if (quizStatus === "started") {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{quiz?.title || "Quiz"}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz?.questions?.length}
            </p>
          </div>
          <div className="flex items-center">
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              Teacher Mode
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Current Question</h2>
            <div className="flex items-center">
              <div className="w-24 h-6 bg-gray-200 rounded-full overflow-hidden mr-2">
                <div
                  className="h-full bg-blue-600 transition-all duration-1000 ease-linear"
                  style={{ width: `${isTimedOut ? "0%": `${(timeLeft / durationPerQues) * 100}%`}` }}
                ></div>
              </div>
              <span className="font-bold">
               {isTimedOut ? "Time's Up!" : `${timeLeft} sec`}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <p className="text-lg font-medium mb-3">
              {currentQuestion?.questionText}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {currentQuestion?.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md ${
                    option.isCorrect
                      ? "bg-green-100 border border-green-500"
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
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 mb-4">
            <button
              disabled={!isTimedOut}
              onClick={handleShowLeaderboard}
              className={`flex-1 py-2 ${
                !isTimedOut
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-700"
              } text-white rounded-md hover:bg-indigo-800`}
            >
              Show Leaderboard
            </button>
            <button
              disabled={!isTimedOut}
              onClick={handleNextQuestion}
              className={`flex-1 py-2 ${
                !isTimedOut ? "bg-blue-300 cursor-not-allowed" : "bg-blue-700"
              } text-white rounded-md hover:bg-blue-800`}
            >
              {currentQuestionIndex < quiz?.questions?.length - 1
                ? "Next Question"
                : "End Quiz"}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Participants ({Object.keys(participants).length})
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {Object.entries(participants).length === 0 ? (
              <p className="text-gray-500 text-center">No participants</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.values(participants).map((player, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-md shadow-sm flex items-center"
                  >
                    {player.photoURL ? (
                      <img
                        src={player.photoURL}
                        alt={player.displayName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                        {player.displayName?.charAt(0).toUpperCase() || "A"}
                      </div>
                    )}
                    <span className="truncate">{player.displayName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleExitQuiz}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Exit Quiz
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default TeacherQuiz;
