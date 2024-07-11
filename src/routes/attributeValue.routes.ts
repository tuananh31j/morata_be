import { attributeValueController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/:detailId', attributeValueController.getAllAttributeValuesByAttribute);
router.post('/', attributeValueController.createNewAttributeValue);
router.patch('/:id', attributeValueController.updateAttributeValue);

export default router;
