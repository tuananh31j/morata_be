import { authController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', authController.refresh);

export default router;
