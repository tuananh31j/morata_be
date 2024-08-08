import { reviewController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/', reviewController.getAllReviewsOfProduct);
router.get('/:id', reviewController.getDetailReivewOfProduct);
router.post('/', authenticate, reviewController.createNewReview);
router.patch('/:id', authenticate, reviewController.updateReview);

export default router;
