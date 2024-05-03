import { dataController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/', dataController.generateData);

export default router;
