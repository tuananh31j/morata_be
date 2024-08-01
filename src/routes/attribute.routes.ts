import { ROLE } from '@/constant/allowedRoles';
import { attributeController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/all', attributeController.getAllAttributes);
router.get('/:categoryId', attributeController.getAttributeByCategory);
router.post('/', authenticate, authorize(ROLE.ADMIN), attributeController.getCreateAttribute);

export default router;
