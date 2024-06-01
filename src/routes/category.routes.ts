import { Router } from 'express';
import { categoryController } from '@/controllers';
import { validateObjectId } from '@/validation';
import { createCategoryValidation, updateCategoryValidation } from '@/validation/category';

const router = Router();

router.get('/all', categoryController.getAllCategories);
router.get('/popular', categoryController.getPopularCategories);
router.get('/:id', [validateObjectId], categoryController.getDetailedCategory);
router.post('/', [createCategoryValidation], categoryController.createNewCategory);
router.patch('/:id', [validateObjectId, updateCategoryValidation], categoryController.updateCateGory);

export default router;
