import { checkoutController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.post('/create-checkout-session', authenticate, checkoutController.createCheckoutStripe);
router.post('/webhook', checkoutController.handleSessionEventsStripe);

router.post('/create-checkout-with-vnpay', authenticate, checkoutController.createPaymentUrlWithVNpay);
router.get('/vnpay-return', checkoutController.vnpayReturn);
router.get('/vnpay-ipn', authenticate, checkoutController.vnpayIPN);

export default router;
