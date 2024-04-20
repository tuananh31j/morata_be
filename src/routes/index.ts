import { Router } from 'express';
import categoryRouter from './category.routes';

const router = Router();

router.use('/category', categoryRouter);

export default router;
