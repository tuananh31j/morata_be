import { updateCartItemQuantity } from './../services/cart.service';
import { Router } from 'express';
import { cartController } from '@/controllers';

const router = Router();

router.get('/:id', cartController.getCartByUser);
router.post('/add', cartController.addToCart);
router.patch('/update_quantity', cartController.updateCartItemQuantity);
// router.patch('/decrease', cartController.decreaseCartItemQuantity);
router.patch('/remove', cartController.removeCartItem);
router.patch('/removeAll', cartController.removeAllCartItems);

export default router;
