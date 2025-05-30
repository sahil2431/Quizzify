import React, { useState, useEffect , useRef} from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, set, off } from "firebase/database";
import { database } from "../../firebase";
import WaitingRoom from "./WaitingRoom";
import QuizQuestion from "./QuizQuestion";
import Leaderboard from "./Leaderboard";
import QuizResults from "./QuizResults";
import useQuizSecurity from "../../hooks/useQuizSecurity";

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
  const [securityViolations, setSecurityViolations] = useState([]);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [violationMessage, setViolationMessage] = useState("");
  const questionTrackerRef = useRef({
    lastSeenIndex: null,
    isFirstLoad: true
  });


  const handleSecurityViolation = (violation) => {
    if(violation.disqualify) {
      setViolationMessage("You have been disqualified due to multiple security violations.");
      setShowViolationWarning(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    }
    setSecurityViolations(prev => [...prev, {
      time: new Date().toISOString(),
      message: violation.message
    }]);

    setShowViolationWarning(true);
    setViolationMessage(violation.message);
    
  }

   useQuizSecurity(handleSecurityViolation);
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
      console.log(quiz)
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
            setTotalNumberofQuestion(data.questions.length || 0);
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


  return (
    <>
     
      {showViolationWarning && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold">Security Violation</p>
                <p className="text-sm">{violationMessage}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowViolationWarning(false)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close warning"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Existing render logic */}
      {quizStatus === "waiting" ? (
        <WaitingRoom quiz={quiz} quizCode={quizId} onExit={() => navigate("/dashboard")} />
      ) : quizStatus === "completed" || currentQuestionIndex >= quiz?.questions?.length ? (
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
      ) : showLeaderboard ? (
        <Leaderboard
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalNumberofQuestion}
          quizId={quizId}
          currentUser={currentUser}
          isTeacher={false}
        />
      ) : isLoading && quizStatus === "started" ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading next question...
          </p>
        </div>
      ) : (
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
      )}
    </>
  );
};

export default StudentQuiz;
