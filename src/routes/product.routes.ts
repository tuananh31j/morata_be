import { Router } from 'express';
import { productController } from '@/controllers';
import { validateObjectId } from '@/validation';
import upload from '@/middlewares/multerMiddleware';
import { addProductValidation } from '@/validation/product';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { ROLE } from '@/constant/allowedRoles';

const router = Router();

router.get('/all', productController.getAllProducts);
router.get('/latest', productController.getTopLatestProducts);
router.get('/deals', productController.getTopDealsOfTheDay);
router.get('/reviews', productController.getTopReviewsProducts);
router.get('/related', productController.getTopRelatedProducts);
router.get('/byCate/:cateId', productController.getAllProductByCategory);
router.get('/:id', [validateObjectId], productController.getDetailedProduct);

router.post(
  '/',
  authenticate,
  authorize(ROLE.ADMIN),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  [addProductValidation],
  productController.createNewProduct,
);
router.patch(
  '/:id',
  [authenticate, authorize(ROLE.ADMIN), validateObjectId],
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  productController.updateProduct,
);
router.delete('/:id', [authenticate, authorize(ROLE.ADMIN), validateObjectId], productController.deleteProduct);

export default router;
