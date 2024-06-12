import { orderController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, orderController.getAllOrders);
router.get('/user', authenticate, orderController.getAllOrdersByUser);
router.get('/:id', authenticate, orderController.getDetailedOrder);
router.post('/', authenticate, orderController.createOrder);
router.post('/cancel', authenticate, orderController.cancelOrder);

export default router;
