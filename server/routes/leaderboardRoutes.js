import {Router} from 'express';
import {getLeaderboardByQuizCode, getLeaderboardByStudentUID, saveLeaderboard} from '../controllers/leaderboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/save' , authMiddleware , saveLeaderboard);
router.get('/get' , authMiddleware , getLeaderboardByStudentUID);
router.get('/get/:quizCode' , authMiddleware , getLeaderboardByQuizCode);

export default router;