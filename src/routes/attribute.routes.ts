import { ROLE } from '@/constant/allowedRoles';
import { attributeController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { createAttributeValidation, updateAttributeValidation } from '@/validation/attribute/attributeValidation';
import { Router } from 'express';

const router = Router();

router.get('/all', attributeController.getAllAttributes);
router.get('/:categoryId', attributeController.getAttributeByCategory);
router.get('/details/:attributeId', attributeController.getAttributeDetails);
router.post('/', authenticate, authorize(ROLE.ADMIN), [createAttributeValidation], attributeController.CreateAttribute);
router.put(
    '/:attributeId',
    authenticate,
    authorize(ROLE.ADMIN),
    [updateAttributeValidation],
    attributeController.updateAttibute,
);

export default router;
