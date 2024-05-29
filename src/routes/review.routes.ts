import { reviewController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/', reviewController.createNewReview);

export default router;
