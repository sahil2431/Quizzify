import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    quizCode : {
        type: String,
        required: true,
    },
    studentUID: {
        type: String,
        required: true,
    },
    studentName: {
        type: String,
        required: true,
    },
    photoURL: {
        type: String,
    },
    maxScore: {
        type: Number,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
} , {timestamps: true , versionKey: false});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;