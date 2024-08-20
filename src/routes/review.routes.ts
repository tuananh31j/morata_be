import { reviewController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/', reviewController.getAllReviewsOfProduct);
router.get('/all', reviewController.getAllReviews);
router.get('/report/all', reviewController.getAllReviewsIsReported);
router.get('/:id', reviewController.getDetailReivewOfProduct);

router.post('/', authenticate, reviewController.createNewReview);
router.post('/report', authenticate, reviewController.CreateReportReview);
router.delete('/report/:id', authenticate, reviewController.deleteReportReview);
router.delete('/:id', authenticate, reviewController.deleteReview);
router.patch('/:id', authenticate, reviewController.updateReview);

export default router;
