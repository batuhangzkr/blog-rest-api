import { Router } from 'express';
import { addComment, deleteComment, replyToComment, updateComment } from '../controllers/commentController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Belirli bir blog yazısına yorum ekleme
router.post('/posts/:postId/comments', authMiddleware, addComment);

// Belirli bir yorumu güncelleme
router.put('/comments/:commentId', authMiddleware, updateComment);

// Belirli bir yorumu silme
router.delete('/comments/:commentId', authMiddleware, deleteComment);

// Belirli bir yoruma yanıt verme
router.post('/comments/:commentId/reply', authMiddleware, replyToComment);

export default router;
