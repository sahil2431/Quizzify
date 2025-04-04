import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    photoURL: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    createdQuizzes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    }],
    attemptedQuizzes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuizAttempt'
    }]
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User; 