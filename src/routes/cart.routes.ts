import { Router } from 'express';
import { cartController } from '@/controllers';
import { validateObjectId } from '@/validation';

const router = Router();

router.get('/', [validateObjectId], cartController.getCartByUser);
router.post('/add', cartController.addToCart);
router.patch('/increase', cartController.increaseCartItemQuantity);
router.patch('/decrease', cartController.decreaseCartItemQuantity);
router.patch('/remove-item', cartController.decreaseCartItemQuantity);
router.patch('/remove-all', cartController.decreaseCartItemQuantity);

export default router;
