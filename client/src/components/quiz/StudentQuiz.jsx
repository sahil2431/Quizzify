import React, { useState, useEffect } from "react";
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

  // For AI quizzes only
  useEffect(() => {
    if (!isAIQuiz && quizId) {
      const quizRef = ref(database, `quizzes/${quizId}`);

      onValue(quizRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setQuizStatus(data.status || "waiting");
          setTotalNumberofQuestion(data.questions.length || 0);
          setCurrentQuestionIndex(data.currentQuestionIndex || 0);
          setDurationPerQues(data.durationPerQues);
          setShowLeaderboard(data.leaderboard.showLeaderboard || false);
          setTimeLeftCurrQues(data.timeLeftCurrQues || 0);
          if (data.questions && typeof data.currentQuestionIndex === "number") {
            setCurrentQuestion(data.questions[data.currentQuestionIndex]);
          }
        }
      });

      return () => {
        off(quizRef);
      };
    } else if (isAIQuiz) {
      setTotalNumberofQuestion(quiz.length || 0);
      setQuizStatus("started");
      setDurationPerQues(quiz?.durationPerQuestion || 30);
      setTimeLeftCurrQues(quiz?.durationPerQuestion || 30);

      onValue(ref(database, `aiQuiz/${currentUser.uid}/${quizId}`), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCurrentQuestionIndex(data.currentQuestionIndex || 0);
          setCurrentQuestion(data.questions[data.currentQuestionIndex]);
          setQuizStatus(data.status || "started");
        }
      });
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
  const handleExitQuiz = () => {
    //navigate("/dashboard");
  };

  if (quizStatus === "waiting") {
    return (
      <WaitingRoom quiz={quiz} quizCode={quizId} onExit={handleExitQuiz} />
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
          onExit={handleExitQuiz}
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

  return (
    <QuizQuestion
      isAIQuiz={isAIQuiz}
      question={currentQuestion}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={totalNumberofQuestion}
      durationPerQues={durationPerQues}
      timeLeft={timeLeftCurrQues}
      onExit={handleExitQuiz}
      currentQuestionIndex={currentQuestionIndex}
      quizId={quizId}
      setTimeLeft={setTimeLeftCurrQues}
    />
  );
};

export default StudentQuiz;
