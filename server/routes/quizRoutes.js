import {Router} from "express";
import { generateQuiz, getAifeedback, getQuizzByCode, getQuizzesOfUser } from "../controllers/quizzController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.get("/getAll" , authMiddleware , getQuizzesOfUser)
router.post("/generate-feedback" ,authMiddleware ,  getAifeedback)
router.post("/generate-quiz" , generateQuiz)
router.get("/:code" , authMiddleware , getQuizzByCode)

export default router;