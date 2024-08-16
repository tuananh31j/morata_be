import { ROLE } from '@/constant/allowedRoles';
import { attributeController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/all', attributeController.getAllAttributes);
router.get('/:categoryId', attributeController.getAttributeByCategory);
router.get('/details/:attributeId', attributeController.getAttributeDetails);
router.post('/', authenticate, authorize(ROLE.ADMIN), attributeController.CreateAttribute);
router.put('/:attributeId', authenticate, authorize(ROLE.ADMIN), attributeController.updateAttibute);

export default router;
