import { reviewController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/', reviewController.createNewReview);
router.get('/', reviewController.getAllReviewsOfProduct);

export default router;
