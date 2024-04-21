import { Router } from 'express';
import { categoryController } from '@/controllers';
import { categoryValidation, validateObjectId } from '@/validation';

const router = Router();

router.get('/all', categoryController.getAllCategories);
router.get('/:id', [validateObjectId], categoryController.getDetailedCategory);
router.post('/', [categoryValidation], categoryController.createNewCategory);
router.patch('/:id', [validateObjectId, categoryValidation], categoryController.updateCateGory);
router.delete('/:id', [validateObjectId], categoryController.deleteCategory);

export default router;
