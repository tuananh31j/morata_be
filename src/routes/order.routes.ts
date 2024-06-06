import { orderController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/', orderController.createOrder);

export default router;
