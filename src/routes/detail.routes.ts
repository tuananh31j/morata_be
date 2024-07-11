import { detailController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/:categoryId', detailController.getAllDetailsByCategory);
router.post('/', detailController.createNewDetail);
router.patch('/:id', detailController.updateDetail);

export default router;
