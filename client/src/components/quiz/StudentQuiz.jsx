import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, set } from "firebase/database";
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
  setQuizStartTime
}) => {
  const navigate = useNavigate();
  const [currentQuestion , setCurrentQuestion] = useState(null);
  const [timeLeftCurrQues , setTimeLeftCurrQues] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [quizStatus, setQuizStatus] = useState("waiting");
  const [totalNumberofQuestion , setTotalNumberofQuestion] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [durationPerQues , setDurationPerQues] = useState(30);

  
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
          setDurationPerQues(data.durationPerQues)
          setShowLeaderboard(data.leaderboard.showLeaderboard || false);
          setTimeLeftCurrQues(data.timeLeftCurrQues || 0);
          if (data.questions && typeof data.currentQuestionIndex === 'number') {
            setCurrentQuestion(data.questions[data.currentQuestionIndex]);
          }
        }
      });
      
      return () => {
        off(quizRef);
      };
    }
  }, [quizId, isAIQuiz])


  // Handle user selecting an answer
  

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
<Leaderboard
  quizId={quizId}
  isTeacher={false}
  currentUser={currentUser}
  totalQuestions={totalNumberofQuestion}
  currentQuestion={currentQuestionIndex + 1}
/>
        <QuizResults
          quizId={quizId}
          currentUser={currentUser}
          onExit={handleExitQuiz}
          isTeacher={false}
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
      question={currentQuestion}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={totalNumberofQuestion}
      durationPerQues={durationPerQues}
      timeLeft={timeLeftCurrQues}
      onExit={handleExitQuiz}
      currentQuestionIndex={currentQuestionIndex}
      quizId={quizId}
    />
  );
};

export default StudentQuiz; 