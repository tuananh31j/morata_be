import { locationController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/user', authenticate, locationController.getAllLocationByUser);
router.post('/', authenticate, locationController.addNewLocation);
router.patch('/:locationId', authenticate, locationController.updateLocation);
router.delete('/:locationId', authenticate, locationController.deleteLocation);

export default router;
