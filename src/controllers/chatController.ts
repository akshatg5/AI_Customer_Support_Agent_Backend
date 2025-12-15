import { Response } from 'express';
import { AuthRequest } from '../types/express';
import { ChatMessage } from '../models/ChatMessage';
import { AIService } from '../services/aiService';

const aiService = new AIService();

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    const userId = req.user?.userId;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Save user message
    const userMessage = new ChatMessage({
      userId,
      role: 'user',
      content: message,
    });
    await userMessage.save();

    // Get recent chat history (last 10 messages)
    const recentMessages = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    // Reverse to get chronological order
    const conversationHistory = recentMessages.reverse().map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Generate AI response
    const aiResponse = await aiService.generateResponse(conversationHistory);

    // Save AI response
    const assistantMessage = new ChatMessage({
      userId,
      role: 'assistant',
      content: aiResponse,
    });
    await assistantMessage.save();

    res.status(200).json({
      userMessage: {
        id: userMessage._id,
        role: userMessage.role,
        content: userMessage.content,
        timestamp: userMessage.timestamp,
      },
      assistantMessage: {
        id: assistantMessage._id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        timestamp: assistantMessage.timestamp,
      },
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const messages = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      messages: messages.reverse(),
      count: messages.length,
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
};