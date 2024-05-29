import { orderController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/checkout', orderController.createNewOrder);

export default router;
