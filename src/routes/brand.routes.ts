import { Router } from 'express';
import { brandController } from '@/controllers';
import { validateObjectId } from '@/validation';
import { createBrandValidation, updateBrandValidation } from '@/validation/brand';
import { authenticate } from '@/middlewares/authenticateMiddleware';

const router = Router();

router.get('/all', brandController.getAllBrands);
router.get('/:id', [validateObjectId], brandController.getDetailedBrand);
router.post('/', authenticate, [createBrandValidation], brandController.createNewBrand);
router.patch('/:id', authenticate, [validateObjectId, updateBrandValidation], brandController.updateBrand);

export default router;
