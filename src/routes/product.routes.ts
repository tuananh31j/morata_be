import { Router } from 'express';
import { productController } from '@/controllers';
import { validateObjectId } from '@/validation';

const router = Router();

router.get('/all', productController.getAllProducts);
router.get('/:id', [validateObjectId], productController.getDetailedProduct);
router.get('/top-latest', productController.getTopLatestProducts);
router.get('/top-deals', productController.getTopDealsOfTheDay);
router.get('/top-reviews', productController.getTopReviewsProducts);
router.get('/top-relative/:id/:cateId', [validateObjectId], productController.getTopRelativeProducts);

router.post('/', productController.createNewProduct);
router.patch('/:id', [validateObjectId], productController.updateProduct);
router.delete('/:id', [validateObjectId], productController.deleteProduct);

export default router;
