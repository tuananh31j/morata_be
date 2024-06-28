import { userController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import upload from '@/middlewares/multerMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/private', authenticate, userController.getUserProfile);
router.patch('/private', authenticate, upload.single('avatar'), userController.updateUserProfile);

export default router;
