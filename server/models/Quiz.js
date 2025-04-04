import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  explanation: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 1
  }
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questions: [questionSchema],
    isPublic: {
      type: Boolean,
      default: false
    },
    accessCode: {
      type: String,
      default: ''
    },
    duration: {
      type: Number, // Duration in minutes
      default: 30
    },
    startTime: {
      type: Date,
      default: null
    },
    endTime: {
      type: Date,
      default: null
    },
    attempts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuizAttempt'
    }]
  },
  { timestamps: true }
);

// Generate a random access code before saving if not provided
quizSchema.pre('save', function(next) {
  if (!this.accessCode && !this.isPublic) {
    // Generate a random 6-character alphanumeric code
    this.accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz; 