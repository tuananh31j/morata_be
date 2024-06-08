import { orderController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/user', authenticate, orderController.getAllOrdersByUser);
router.get('/:id', authenticate, orderController.getDetailedOrder);

router.post('/', authenticate, orderController.createOrder);

export default router;
