import { Router } from 'express';
import { productController } from '@/controllers';
import { validateObjectId } from '@/validation';
import upload from '@/middlewares/multerMiddleware';
import { addProductValidation, updateProductValidation } from '@/validation/product';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { ROLE } from '@/constant/allowedRoles';

const router = Router();

router.get('/all', productController.getAllProducts);
router.get('/top-sold', productController.getTop10ProductSold);
router.get('/latest', productController.getTopLatestProducts);
router.get('/deals', productController.getTopDealsOfTheDay);
router.get('/reviews', productController.getTopReviewsProducts);
router.get('/related', productController.getTopRelatedProducts);
router.get('/:id', [validateObjectId], productController.getDetailedProduct);
// router.get('/reviews/:id', productController.getDetailedProductReview);
router.get('/filter/:categoryId', productController.filterProductsBycategory);

// @admin
router.get('/portal/all', authenticate, authorize(ROLE.ADMIN), productController.getAllProductAdmin);
router.get('/portal/:id', authenticate, authorize(ROLE.ADMIN), productController.getDetailedProductAdmin);

router.post(
    '/',
    authenticate,
    authorize(ROLE.ADMIN),
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
        { name: 'variationImages', maxCount: 5 },
    ]),
    [addProductValidation],
    productController.createNewProduct,
);
router.post(
    '/variation',
    authenticate,
    authorize(ROLE.ADMIN),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    productController.addNewVariationToProduct,
);
router.patch(
    '/:id',
    [authenticate, authorize(ROLE.ADMIN), validateObjectId],
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
    ]),
    [updateProductValidation],
    productController.updateProduct,
);
router.patch(
    '/variation/:variationId',
    [authenticate, authorize(ROLE.ADMIN), validateObjectId],
    upload.fields([{ name: 'image', maxCount: 1 }]),
    productController.updateProductVariation,
);
router.patch('/hide/:productId', [authenticate, authorize(ROLE.ADMIN)], productController.hiddenProduct);
router.patch('/show/:productId', [authenticate, authorize(ROLE.ADMIN)], productController.showProduct);

export default router;
