import { attributeController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/:categoryId', attributeController.getAllAttributesByCategory);
router.post('/', attributeController.createAttribute);
router.post('/:id/details', attributeController.addValueToAttribute);

export default router;
