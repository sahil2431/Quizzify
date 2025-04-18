import {Router} from "express";
import { getQuizzByCode, getQuizzesOfUser } from "../controllers/quizzController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.get("/getAll" , authMiddleware , getQuizzesOfUser)
router.get("/:code" , authMiddleware , getQuizzByCode)

export default router;