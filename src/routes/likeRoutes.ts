import { Router } from 'express';
import { likePost, likeComment } from '../controllers/likeControllers';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/posts/:postId/like', authMiddleware, likePost);
router.post('/comments/:commentId/like', authMiddleware, likeComment);

export default router;
