import { Router } from 'express';
import { productController } from '@/controllers';
import { validateObjectId } from '@/validation';
import upload from '@/middlewares/multerMiddleware';
import { addProductValidation } from '@/validation/product';

const router = Router();

router.get('/all', productController.getAllProducts);
router.get('/latest', productController.getTopLatestProducts);
router.get('/deals', productController.getTopDealsOfTheDay);
router.get('/reviews', productController.getTopReviewsProducts);
router.get('/related', productController.getTopRelativeProducts);
router.get('/:id', [validateObjectId], productController.getDetailedProduct);

router.post(
  '/',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  [addProductValidation],
  productController.createNewProduct,
);
router.patch('/:id', [validateObjectId], productController.updateProduct);
router.delete('/:id', [validateObjectId], productController.deleteProduct);

export default router;
