import { Router } from 'express';
import { cartController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';

const router = Router();

router.get('/:id', cartController.getCartByUser);
router.post('/add', cartController.addToCart);
router.patch('/increase', cartController.increaseCartItemQuantity);
router.patch('/decrease', cartController.decreaseCartItemQuantity);
router.patch('/remove', cartController.removeCartItem);
router.patch('/removeAll', cartController.removeAllCartItems);

export default router;
