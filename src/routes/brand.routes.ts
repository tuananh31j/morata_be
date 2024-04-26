import { Router } from 'express';
import { brandController } from '@/controllers';
import { brandValidation, validateObjectId } from '@/validation';

const router = Router();

router.get('/all', brandController.getAllBrands);
router.get('/:id', [validateObjectId], brandController.getDetailedBrand);
router.post('/', brandController.createNewBrand);
router.patch('/:id', [validateObjectId], brandController.updateBrand);
router.delete('/:id', [validateObjectId], brandController.deleteBrand);

export default router;
