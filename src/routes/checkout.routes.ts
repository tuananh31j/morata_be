import { checkoutController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/create-checkout-session', checkoutController.createCheckout);
router.post('/webhook', checkoutController.handleSessionEvents);

export default router;
