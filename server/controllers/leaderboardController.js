import Leaderboard from "../models/Leaderboard.js";

export const saveLeaderboard = async (req, res) => {
    const { quizCode, studentName, photoURL, score , maxScore  } = req.body;
    console.log(req.body);
    const studentUID = req.dbUser.uid;
    if (!quizCode || !studentName || score === undefined || score === null || maxScore === undefined || maxScore === null) {
        console.error("Missing required fields:", { quizCode, studentName, score, maxScore });
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const existingEntry = await Leaderboard.findOne({quizCode, studentUID});
        if (existingEntry) {
            existingEntry.score = score;
            await existingEntry.save();
            return res.status(200).json({ status: true, message: "Leaderboard updated successfully" });
        } else {
            const newEntry = new Leaderboard({
                
                quizCode,
                studentUID,
                studentName,
                photoURL,
                score,
                maxScore,
            });
            await newEntry.save();
            return res.status(201).json({ status: true, message: "Leaderboard entry created successfully" });
        }
    }catch (error) {
        console.error("Error saving leaderboard:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

export const getLeaderboardByQuizCode = async (req, res) => {
    const { quizCode } = req.params;
    if (!quizCode) {
        return res.status(400).json({ error: "Quiz code is required" });
    }

    try {
        const leaderboardEntries = await Leaderboard.find({ quizCode }).sort({ score: -1 });
        return res.status(200).json({ status: true, leaderboardEntries });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

export const getLeaderboardByStudentUID = async (req, res) => {
    const studentUID = req.dbUser.uid;

    try {
        const leaderboardEntries = await Leaderboard.find({ studentUID }).sort({ createdAt: -1 });
        if (!leaderboardEntries || leaderboardEntries.length === 0) {
            return res.status(404).json({ status: false, message: "No leaderboard entries found" });
        }

        const totalScore = leaderboardEntries.reduce((acc, entry) => acc + entry.score, 0);
        const totalMaxScore = leaderboardEntries.reduce((acc, entry) => acc + entry.maxScore, 0);
        
        const averagePercentage = Number(((totalScore / totalMaxScore) * 100).toFixed(2));
        return res.status(200).json({ status: true, leaderboardEntries, averagePercentage });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
        
    }
}