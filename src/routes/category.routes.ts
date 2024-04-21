import { Router } from 'express';
import { categoryController } from '@/controllers';

const router = Router();

router.get('/all', categoryController.getAllCategories);
router.get('/:id', categoryController.getDetailedCategory);
router.post('/', categoryController.createNewCategory);
router.patch('/', categoryController.updateCateGory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
