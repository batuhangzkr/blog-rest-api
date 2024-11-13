import { Router } from 'express';
import { createPost, updatePost, deletePost, searchPosts } from '../controllers/postController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/create', authMiddleware, createPost);
router.put('/update/:postId', authMiddleware, updatePost);
router.delete('/delete/:postId', authMiddleware, deletePost);
router.get('/search', searchPosts);

export default router;
