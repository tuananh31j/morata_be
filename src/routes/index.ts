import { Router } from 'express';
import categoryRouter from './category.routes';
import brandRouter from './brand.routes';

const router = Router();

router.use('/category', categoryRouter);
router.use('/brand', brandRouter);

export default router;
