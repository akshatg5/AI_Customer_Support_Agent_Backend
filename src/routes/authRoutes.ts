import { Router } from "express";
import { signup, login, whoami } from "../controllers/authController";
import { authLimiter } from "../middleware/rateLimiter";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.get("/whoami", authenticate, whoami);

export default router;
