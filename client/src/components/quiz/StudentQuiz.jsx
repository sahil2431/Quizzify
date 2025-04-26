import React, { useState, useEffect , useRef} from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, set, off } from "firebase/database";
import { database } from "../../firebase";
import WaitingRoom from "./WaitingRoom";
import QuizQuestion from "./QuizQuestion";
import Leaderboard from "./Leaderboard";
import QuizResults from "./QuizResults";

const StudentQuiz = ({
  quiz,
  quizId,
  currentUser,
  isAIQuiz,
  quizStartTime,
  setQuizStartTime,
}) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeftCurrQues, setTimeLeftCurrQues] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [quizStatus, setQuizStatus] = useState("waiting");
  const [totalNumberofQuestion, setTotalNumberofQuestion] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [durationPerQues, setDurationPerQues] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const questionTrackerRef = useRef({
    lastSeenIndex: null,
    isFirstLoad: true
  });

  // For AI quizzes only
  useEffect(() => {
    if (!isAIQuiz && quizId) {
      const quizRef = ref(database, `quizzes/${quizId}`);

      onValue(quizRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const newQuestionIndex = data.currentQuestionIndex || 0;
          if (!questionTrackerRef.current.isFirstLoad && 
            newQuestionIndex !== questionTrackerRef.current.lastSeenIndex) {
          console.log(
            "Question changed from",
            questionTrackerRef.current.lastSeenIndex,
            "to",
            newQuestionIndex
          );
          setIsLoading(true);
        }

        questionTrackerRef.current.lastSeenIndex = newQuestionIndex;
          
          // First load completed
          if (questionTrackerRef.current.isFirstLoad) {
            questionTrackerRef.current.isFirstLoad = false;
          }
          setQuizStatus(data?.status || "waiting");
          setTotalNumberofQuestion(data?.questions?.length || 0);
          setCurrentQuestionIndex(data?.currentQuestionIndex || 0);
          setDurationPerQues(data?.durationPerQues);
          setShowLeaderboard(data?.leaderboard?.showLeaderboard || false);
          setTimeLeftCurrQues(data?.timeLeftCurrQues || 0);
          if (
            data?.questions &&
            typeof data?.currentQuestionIndex === "number"
          ) {
            setCurrentQuestion(data?.questions[data?.currentQuestionIndex]);
            setTimeout(() => setIsLoading(false), 800);
          }
        }
      });

      return () => {
        off(quizRef);
      };
    } else if (isAIQuiz) {
      setTotalNumberofQuestion(quiz?.length || 0);
      setQuizStatus("started");
      setDurationPerQues(quiz?.durationPerQuestion || 30);
      setTimeLeftCurrQues(quiz?.durationPerQuestion || 30);

      onValue(
        ref(database, `aiQuiz/${currentUser.uid}/${quizId}`),
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setCurrentQuestionIndex(data.currentQuestionIndex || 0);
            setCurrentQuestion(data.questions[data.currentQuestionIndex]);
            setQuizStatus(data.status || "started");
          }
        }
      );
    }
  }, [quizId, isAIQuiz]);

  useEffect(() => {
    if (isAIQuiz) {
      const interval = setInterval(() => {
        setTimeLeftCurrQues((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAIQuiz, currentQuestionIndex]);

  // Exit quiz handler


  if (quizStatus === "waiting") {
    return (
      <WaitingRoom quiz={quiz} quizCode={quizId} onExit={() => navigate("/dashboard")} />
    );
  }

  if (
    quizStatus === "completed" ||
    currentQuestionIndex >= quiz?.questions?.length
  ) {
    return (
      <div>
        {!isAIQuiz && (
          <Leaderboard
            quizId={quizId}
            isTeacher={false}
            currentUser={currentUser}
            totalQuestions={totalNumberofQuestion}
            currentQuestion={currentQuestionIndex + 1}
          />
        )}
        <QuizResults
          quizId={quizId}
          currentUser={currentUser}
          isTeacher={false}
          isAIQuiz={isAIQuiz}
        />
      </div>
    );
  }

  // Show leaderboard between questions
  if (showLeaderboard) {
    return (
      <Leaderboard
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalNumberofQuestion}
        quizId={quizId}
        currentUser={currentUser}
        isTeacher={false}
      />
    );
  }

  if (isLoading && quizStatus === "started") {
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
    <QuizQuestion
      isAIQuiz={isAIQuiz}
      question={currentQuestion}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={totalNumberofQuestion}
      durationPerQues={durationPerQues}
      timeLeft={timeLeftCurrQues}
      currentQuestionIndex={currentQuestionIndex}
      quizId={quizId}
      setTimeLeft={setTimeLeftCurrQues}
    />
  );
};

export default StudentQuiz;
