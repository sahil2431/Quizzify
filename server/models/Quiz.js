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
    isAigenerated : {
      type: Boolean,
      default: false
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    questions: [questionSchema],
    accessCode: {
      type: String,
      default: ''
    },
    durationPerQuestion: {
      type: Number, // Duration in seconds for each question
      default: 10
    },
    startTime: {
      type: Date,
      default: null
    },
    status : {
      type : String,
      enum : ["started" , "completed" , "not started"],
      default : "not started"
    }
  },
  { timestamps: true }
);

quizSchema.pre('save', function(next) {
  if (!this.accessCode && !this.isPublic) {
    this.accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz; 