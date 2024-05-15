import { authController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/register', authController.register);

export default router;
