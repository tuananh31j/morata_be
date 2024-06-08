import { reviewController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/', reviewController.getAllReviewsOfProduct);
router.post('/', authenticate, reviewController.createNewReview);

export default router;
