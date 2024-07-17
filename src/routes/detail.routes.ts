import { detailController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/:categoryId', detailController.getAllDetailsByCategory);
router.get('/:id', detailController.getDetailById);
router.post('/', detailController.createNewDetail);
router.patch('/:id', detailController.updateDetail);
router.patch('/add-value', detailController.addValueToDetail);
router.patch('/remove-value', detailController.removeValueFromDetail);

export default router;
