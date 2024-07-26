import { ROLE } from '@/constant/allowedRoles';
import { orderController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/', authenticate, orderController.getAllOrders);
router.get('/user', authenticate, orderController.getAllOrdersByUser);
router.get('/:id', authenticate, orderController.getDetailedOrder);
router.post('/', authenticate, orderController.createOrder);
router.post('/cancel', authenticate, orderController.cancelOrder);
router.patch('/delivered', authenticate, orderController.deliverOrder);
router.patch('/confirm', authenticate, authorize(ROLE.ADMIN), orderController.confirmOrder);
router.patch('/done', authenticate, authorize(ROLE.ADMIN), orderController.finishOrder);

export default router;
