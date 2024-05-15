import { attributeController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/', attributeController.createNewAttribute);
router.get('/', attributeController.getAllAttributes);

export default router;
