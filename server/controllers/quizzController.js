import FeedBack from "../models/Feedback.js";
import Quiz from "../models/Quiz.js";
import { generateFeedback } from "../services/geminiService.js";
import { generateQuestions } from '../services/geminiService.js';
import {nanoid} from 'nanoid';

export const createQuiz = async (req, res) => {
  console.log(req.body)
  const { title, description, questions , startTime , durationPerQuestion} = req.body;
  const userId = req.dbUser._id;
  if (!title || !questions || questions.length === 0 || !startTime || !durationPerQuestion) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  try {
    const accessCode = nanoid(7).toUpperCase();
    const quiz = await Quiz.insertOne({
      title,
      description,
      questions,
      creator: userId,
      accessCode,
      status: "not started",
      startTime: new Date(startTime),
      durationPerQuestion: parseInt(durationPerQuestion) || 0, 
    })

    if (!quiz) {
      return res.status(500).json({ status: false, message: "Failed to create quiz" });
    }

    return res.status(200).json({ status: true, quiz: { ...quiz, accessCode } });
    
  } catch (error) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
    
  }

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

export const generateQuiz = async(req , res) =>{
  try {
    const { topic, numberOfQuestions, difficulty } = req.body;
   
    if (!topic || !numberOfQuestions || !difficulty) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    //const quizData = await generateQuestions(topic, numberOfQuestions, difficulty);
    const quizData = [
  {
    questionText: 'Which of the following is NOT a fundamental data type in C++?',
    options: [ {_id : 1 , text : "int" , isCorrect : false} , {_id : 1 , text : "int" , isCorrect : false} , {_id : 1 , text : "int" , isCorrect : false} , {_id : 1 , text : "int" , isCorrect : false} ],
    explanation: "The 'string' data type is part of the C++ Standard Template Library (STL), not a fundamental built-in type.  int, float, and bool are fundamental types."
  },
  {
    questionText: 'What keyword is used to declare a constant variable in C++?',
    options: [  {_id : 1 , text : "int" , isCorrect : false} , {_id : 2 , text : "int" , isCorrect : false} , {_id : 3 , text : "int" , isCorrect : false} , {_id : 4 , text : "int" , isCorrect : false}],
    explanation: "The 'const' keyword is used to declae a variable whose value cannot be changed after initialization."
  },
  {
    questionText: 'What is the main purpose of the `iostream` library in C++?',
    options: [ {_id : 1 , text : "int" , isCorrect : false} , {_id : 1 , text : "int" , isCorrect : false} , {_id : 1 , text : "int" , isCorrect : false} , {_id : 1 , text : "int" , isCorrect : true} ],
    explanation: 'The `iostream` library provides the basic input and output functionalities, such as `cout` for output and `cin` for input.'
  }
]
    if (quizData && !quizData.error) {
      console.log("Generated Quiz Questions:", quizData);
      const quiz = await Quiz.insertOne({
        title: `Quiz on ${topic}`,
        questions : quizData.questions,
        creator: req.dbUser._id,
        accessCode: nanoid(7).toUpperCase(),
        isAigenerated: true,
      })
      return res.status(200).json({ status: true, quizData , quizCode : quiz.accessCode });
    } else {
      console.error("Failed to fetch quiz questions:", quizData.error);
      return res.status(500).json({ error: 'Failed to fetch quiz questions' });
    }
    
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}


export const getAifeedback = async (req, res) => {
  try {
    const { questions, answers, quizCode } = req.body;
    const userId = req.dbUser._id;

    let feedback = await FeedBack.findOne({ userId, quizCode });

    if (feedback) {
      return res.status(200).json({ status: true, feedback: feedback.feedback })
    }

    if (!questions || !answers || questions.length !== answers.length) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    let formattedQuestions = [];
    let formattedAnswers = [];

    for (let i = 0; i < questions.length; i++) {

      const studentAnswer = questions[i].options.find(option => {
        if(answers[i].optionId === -1) {
          return "not answered"
        }
        
        if (option._id === answers[i].optionId) {
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
    const feedbackSave = await FeedBack.insertOne({ userId, quizCode, feedback })

    return res.status(200).json({ status: true, feedback });



  } catch (err) {
    console.error('Error generating feedback:', err);
    return res.status(500).json({ error: 'Failed to generate feedback' });
  }
}