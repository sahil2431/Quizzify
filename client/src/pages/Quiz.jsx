import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ref, set, update, get } from "firebase/database";
import { database } from "../firebase";
import {  getQuizByCode, genrateQuiz } from "../services/api";
import TeacherQuiz from "../components/quiz/TeacherQuiz";
import StudentQuiz from "../components/quiz/StudentQuiz";

const QuizPage = () => {
  let { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const isAIQuiz = quizId === undefined || quizId === "ai";
  const isTeacher = userProfile?.role === "teacher";

  // State variables
  const [quiz, setQuiz] = useState(null);
  const [quizIDState, setQuizIdState] = useState(quizId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStatus, setQuizStatus] = useState("waiting"); // waiting, active, completed
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [durationPerQues , setDurationPerQues] = useState(30);

  // Fetch quiz data or set AI quiz data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (isAIQuiz) {
          //Set Ai quizz
          const quizData = location.state;
          if (!quizData) {
            setError("No quiz data found. Please try again.");
            setLoading(false);
            return;
          }

          const response = await genrateQuiz({
            topic: quizData.topic,
            numberOfQuestions: quizData.numQuestions,
            difficulty: quizData.difficulty,
          });
          
          setQuizIdState(response.quizCode);
          quizId = response.quizCode; 
          console.log(response);
          setQuiz(response.quizDate);
          setQuizStatus("started");
          setDurationPerQues(10);
          setLoading(false);
          await set(ref(database , `aiQuiz/${currentUser.uid}/${quizId}`) , {
            quizId : quizId,
            questions : response.quizData,
            currentQuestionIndex : 0,
            points : 0,
          })
        } else {
          try {
            const response = await getQuizByCode(quizId);
            if (response.status) {
              if (isTeacher) {
                setQuiz(response.quiz);
                setQuizStatus("started");
                setDurationPerQues(response.quiz.durationPerQuestion)

                const quizRef = ref(database, `quizzes/${quizId}`);
                const quizSnapshot = await get(quizRef);
                if(quizSnapshot.exists() && quizSnapshot.val().status === "started"){
                  setQuizStatus("started")
                }else {

                  try {
                    await set(
                      ref(database, `quizzes/${quizId}/owner`),
                      currentUser.uid
                    );
  
                    
                    await update(ref(database, `quizzes/${quizId}`), {
                      startedAt: Date.now(),
                      questions: response.quiz.questions,
                      status: "started",
                      currentQuestionIndex: 0,
                      durationPerQues: response.quiz.durationPerQuestion,
                      timeLeftCurrQues : response.quiz.durationPerQuestion
                    });
                    await update(ref(database, `quizzes/${quizId}/leaderboard`), {
                      showLeaderboard: false,
                    });
  
                  } catch (err) {
                    console.error("Firebase update error:", err);
                    setError("Error setting up quiz: " + err.message);
                  }
                }
              } else {

                const userRef = ref(database, `quizzes/${quizId}/leaderboard/${currentUser.uid}`);
  const userSnapshot = await get(userRef);
                await set(
                  ref(database, `quizzes/${quizId}/users/${currentUser.uid}`),
                  true
                );


                // Set user info in the leaderboard
                if(!userSnapshot.exists()) {
                  await set(ref(database, `quizzes/${quizId}/leaderboard/${currentUser.uid}`), {
                    displayName: currentUser.displayName || "Anonymous",
                    photoURL: currentUser.photoURL || "",
                    points: 0,
                    time : 0,
                  })

                }

              }
            } else if (!response.status) {
              setError("");
              setQuizStatus("waiting");
            }
          } catch (err) {
            console.error("Error fetching quiz:", err);
            setError("Failed to load quiz. Please try again.");
          } finally {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error setting up quiz:", err);
        setError("Failed to load quiz. Please try again.");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId, isAIQuiz, location.state, isTeacher]);

  

  

  // Render based on loading/error state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-red-600 mb-4">Error</h2>
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => {
            document.exitFullscreen();
            navigate("/join-quizz")
          }}
        >
          Back to Join Quiz
        </button>
      </div>
    );
  }

  // Render the appropriate component based on user role
  if (isTeacher) {
    return (
      <TeacherQuiz
        quiz={quiz}
        quizId={quizId}
        quizStatus={quizStatus}
        durationPerQues={durationPerQues}
      />
    );
  } else {
    return (
      <StudentQuiz
        quiz={quiz}
        quizId={quizIDState}
        currentUser={currentUser}
        isAIQuiz={isAIQuiz}
        quizStartTime={quizStartTime}
        setQuizStartTime={setQuizStartTime}
        
      />
    );
  }
};

export default QuizPage;
