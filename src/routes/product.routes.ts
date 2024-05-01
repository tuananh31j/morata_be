import { Router } from 'express';
import { productController } from '@/controllers';
import { validateObjectId } from '@/validation';
import upload from '@/middlewares/multerMiddleware';
import { addProductValidation } from '@/validation/product';

const router = Router();

router.get('/all', productController.getAllProducts);
router.get('/:id', [validateObjectId], productController.getDetailedProduct);
router.get('/top-latest', productController.getTopLatestProducts);
router.get('/top-deals', productController.getTopDealsOfTheDay);
router.get('/top-reviews', productController.getTopReviewsProducts);
router.get('/top-relative/:id/:cateId', [validateObjectId], productController.getTopRelativeProducts);

router.post(
  '/',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  // [addProductValidation],
  productController.createNewProduct,
);
router.patch('/:id', [validateObjectId], productController.updateProduct);
router.delete('/:id', [validateObjectId], productController.deleteProduct);

export default router;
