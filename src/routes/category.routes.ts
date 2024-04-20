import categoryController from '@/controllers/index';
import { Router } from 'express';

const router = Router();

router.get('/all', categoryController.getAllCategories);
router.get('/:id', categoryController.getDetailedCategory);
router.post('/', categoryController.createNewCategory);
router.patch('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
