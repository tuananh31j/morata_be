import { statsController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.use(authenticate);
router.get('/total', statsController.totalStats);
router.get('/daily', statsController.orderByDayStats);
router.get('/monthly', statsController.orderByMonthStats);
router.get('/yearly', statsController.orderByYearStats);

export default router;
