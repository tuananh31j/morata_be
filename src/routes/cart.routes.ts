import { Router } from 'express';
import { cartController } from '@/controllers';

const router = Router();

router.get('/:id', cartController.getCartByUser);
router.post('/add', cartController.addToCart);
router.patch('/increase', cartController.increaseCartItemQuantity);
router.patch('/decrease', cartController.decreaseCartItemQuantity);
router.patch('/remove', cartController.removeCartItem);
router.delete('/removeAll', cartController.removeAllCartItems);

export default router;
