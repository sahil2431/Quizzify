import Quiz from "../models/Quiz.js";

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
