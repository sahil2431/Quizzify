import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOptions: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  isCorrect: {
    type: Boolean,
    default: false
  },
  pointsEarned: {
    type: Number,
    default: 0
  }
});

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    answers: [answerSchema],
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date,
      default: null
    },
    totalScore: {
      type: Number,
      default: 0
    },
    maxPossibleScore: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    aiGeneratedFeedback: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

export default QuizAttempt; 