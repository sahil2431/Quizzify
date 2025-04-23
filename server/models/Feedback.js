import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    quizCode : {
        type: String,
        required: true
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },

    feedback : {
        type : String,
        required : true
    }
})

const FeedBack = mongoose.model('Feedback' , feedbackSchema);

export default FeedBack;