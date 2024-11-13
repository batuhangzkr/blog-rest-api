import { Router } from 'express';
import { getProfile, updateProfile, uploadProfilePhoto } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Sadece profil fotoğrafı yüklemek için route
router.put('/profile/photo', authMiddleware, upload.single('profileImage'), uploadProfilePhoto);

export default router;
