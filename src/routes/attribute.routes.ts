import { attributeController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/:detailId', attributeController.getAllAttributesByDetail);
router.post('/', attributeController.createNewAttribute);
router.patch('/:id', attributeController.updateAttribute);

export default router;
