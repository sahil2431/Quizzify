import {Router} from "express";
import { getAifeedback, getQuizzByCode, getQuizzesOfUser } from "../controllers/quizzController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.get("/getAll" , authMiddleware , getQuizzesOfUser)
router.post("/generate-feedback" ,authMiddleware ,  getAifeedback)
router.get("/:code" , authMiddleware , getQuizzByCode)

export default router;