import { attributeController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/all', attributeController.getAllAttributes);
router.get('/:categoryId', attributeController.getAttributeByCategory);
router.post('/', attributeController.getCreateAttribute);

export default router;
