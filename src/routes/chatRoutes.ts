import { Router } from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';
import { chatLimiter } from '../middleware/rateLimiter';

const router = Router();

// All chat routes require authentication
router.use(authenticate);

router.post('/send', chatLimiter,sendMessage);
router.get('/history',getChatHistory);

export default router;