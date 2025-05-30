import {Router} from "express";
import { createQuiz, generateQuiz, getAifeedback, getQuizzByCode, getQuizzesOfUser } from "../controllers/quizzController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.post("/create" , authMiddleware , createQuiz)
router.get("/getAll" , authMiddleware , getQuizzesOfUser)
router.post("/generate-feedback" ,authMiddleware ,  getAifeedback)
router.post("/generate-quiz" ,authMiddleware, generateQuiz)
router.get("/:code" , authMiddleware , getQuizzByCode)

export default router;