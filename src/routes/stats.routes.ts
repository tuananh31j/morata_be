import { statsController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.use(authenticate);
router.use('', statsController.statsCommon);

export default router;
