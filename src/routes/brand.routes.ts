import { Router } from 'express';
import { brandController } from '@/controllers';
import { validateObjectId } from '@/validation';
import { createBrandValidation, updateBrandValidation } from '@/validation/brand';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { ROLE } from '@/constant/allowedRoles';

const router = Router();

router.get('/all', brandController.getAllBrands);
router.get('/:id', [validateObjectId], brandController.getDetailedBrand);
router.post(
    '/',
    authenticate,
    authenticate,
    authorize(ROLE.ADMIN),
    // [createBrandValidation],
    brandController.createNewBrand,
);
router.patch(
    '/:id',
    authenticate,
    authenticate,
    authorize(ROLE.ADMIN),
    // [validateObjectId, updateBrandValidation],
    brandController.updateBrand,
);

export default router;
