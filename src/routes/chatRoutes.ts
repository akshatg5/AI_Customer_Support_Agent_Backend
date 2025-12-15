import { Router } from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All chat routes require authentication
router.use(authenticate);

router.post('/send', sendMessage);
router.get('/history', getChatHistory);

export default router;