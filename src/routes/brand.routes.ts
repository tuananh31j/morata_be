import { Router } from 'express';
import { brandController } from '@/controllers';
import { validateObjectId } from '@/validation';
import { createBrandValidation, updateBrandValidation } from '@/validation/brand';

const router = Router();

router.get('/all', brandController.getAllBrands);
router.get('/:id', [validateObjectId], brandController.getDetailedBrand);
router.post('/', [createBrandValidation], brandController.createNewBrand);
router.patch('/:id', [validateObjectId, updateBrandValidation], brandController.updateBrand);

export default router;
