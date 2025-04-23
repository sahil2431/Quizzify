import FeedBack from "../models/Feedback.js";
import Quiz from "../models/Quiz.js";
import { generateFeedback } from "../services/geminiService.js";

function separateQuizData(quizText) {
  // Regular expression to match each question and its answer options
  const questionRegex = /(\d+)\.\s*(.*?)\s*(a\))\s*(.*?)\s*(b\))\s*(.*?)\s*(c\))\s*(.*?)\s*(d\))\s*(.*?)\s*\*\*Correct Answer: (.*?)\*\*/gs;

  let questions = [];
  let answers = [];

  let match;
  while ((match = questionRegex.exec(quizText)) !== null) {
      const question = match[2].trim();
      const options = [
          match[4].trim(), // option a
          match[6].trim(), // option b
          match[8].trim(), // option c
          match[10].trim() // option d
      ];
      const correctAnswer = match[11].trim();

      // Store the question and options in the questions array
      questions.push({
          questionText: question,
          options: options
      });

      // Store the correct answer in the answers array
      answers.push(correctAnswer);
  }

  return { questions, answers };
}

export const getQuizzByCode = async (req, res) => {
  const accessCode = req.params.code;
  if (!accessCode) {
    return res
      .status(400)
      .json({ status: false, message: "Access code is required" });
  }

  try {
    const quiz = await Quiz.findOne({ accessCode });

    if (!quiz) {
      console.log("here")
      return res.status(404).json({ status: false, message: "Quiz not found" });
    }
    if (quiz.status === "completed") {
      return res
        .status(400)
        .json({ status: false, message: "Quiz already completed" });
    }
    let started = false;
    if (quiz.status === "started") {
      started = true;
    }
    if (req.dbUser._id.toString() === quiz.creator.toString()) {
      quiz.status = "started";
      quiz.startTime = new Date();
      await quiz.save();
      return res.status(200).json({ quiz, status: true });
    }
    return res.status(200).json({ status: started });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export const getQuizzesOfUser = async (req, res) => {
  const userId = req.dbUser._id;
  try {
    const quizzes = await Quiz.find({ creator: userId });
    
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ status: false, message: "No quizzes found" });
    }
    return res.status(200).json({ quizzes, status: true });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export const getAifeedback = async(req , res) => {
  try {
    const { questions, answers , quizCode } = req.body;
    const userId = req.dbUser._id;

    let feedback = await FeedBack.findOne({userId , quizCode});

    if(feedback) {
      return res.status(200).json({status : true , feedback : feedback.feedback})
    }
    
    if (!questions || !answers || questions.length !== answers.length) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    let formattedQuestions = [];
    let formattedAnswers = [];

    for(let i = 0; i < questions.length; i++) {
      
      const studentAnswer = questions[i].options.find(option => {
        if(option._id === answers[i].optionId) {
          return option.text;
        }
      })
      formattedQuestions.push({
        questionText: questions[i].questionText,
        correctAnswer: questions[i].options.find(option => option.isCorrect).text,
      });
      formattedAnswers.push(studentAnswer.text);
    } 
      
    feedback = await generateFeedback(formattedQuestions, formattedAnswers);
    const feedbackSave = await FeedBack.insertOne({userId , quizCode , feedback})
    
    return res.status(200).json({ status : true , feedback });


   
  } catch (err) {
    console.error('Error generating feedback:', err);
    return res.status(500).json({ error: 'Failed to generate feedback' });
  }
}