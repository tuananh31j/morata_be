import { attributeController } from '@/controllers';
import { attribute } from '@/services';
import { Router } from 'express';

const router = Router();

router.post('/', attributeController.createNewAttribute);
router.get('/', attributeController.getAllAttributes);

export default router;
