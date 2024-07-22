import { locationController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/', locationController.getAllLocation);
router.post('/', locationController.addNewLocation);

export default router;
