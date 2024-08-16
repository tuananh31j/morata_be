import { Router } from 'express';
import { categoryController } from '@/controllers';
import { validateObjectId } from '@/validation';
import { createCategoryValidation, updateCategoryValidation } from '@/validation/category';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { ROLE } from '@/constant/allowedRoles';

const router = Router();

router.get('/all', categoryController.getAllCategories);
router.get('/popular', categoryController.getPopularCategories);
router.get('/:id', [validateObjectId], categoryController.getDetailedCategory);
router.post(
    '/',
    authenticate,
    authenticate,
    authorize(ROLE.ADMIN),
    [createCategoryValidation],
    categoryController.createNewCategory,
);
router.patch(
    '/:id',
    authenticate,
    authorize(ROLE.ADMIN),
    // [validateObjectId, updateCategoryValidation],
    categoryController.updateCateGory,
);

export default router;
