import { checkoutController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.post('/create-checkout-session', authenticate, checkoutController.createCheckout);
router.post('/webhook', checkoutController.handleSessionEvents);

export default router;
