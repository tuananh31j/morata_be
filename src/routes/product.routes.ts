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

// @admin
router.get('/portal/all', authenticate, authorize(ROLE.ADMIN), productController.getAllProductAdmin);
router.get('/portal/:id', authenticate, authorize(ROLE.ADMIN), productController.getDetailedProductAdmin);
router.get('/portal/active', authenticate, authorize(ROLE.ADMIN), productController.getProductsActive);
router.get('/portal/hidden', authenticate, authorize(ROLE.ADMIN), productController.getProductsHidden);

router.post(
    '/',
    authenticate,
    authorize(ROLE.ADMIN),
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 5 },
        { name: 'variationImages', maxCount: 5 },
    ]),
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
    productController.updateProduct,
);
router.patch(
    '/variation/:variationId',
    [authenticate, authorize(ROLE.ADMIN), validateObjectId],
    upload.fields([{ name: 'image', maxCount: 1 }]),
    productController.updateProductVariation,
);
router.delete('/:id', [authenticate, authorize(ROLE.ADMIN), validateObjectId], productController.deleteProduct);

export default router;
