import { Router } from 'express';
import categoryRouter from './category.routes';
import brandRouter from './brand.routes';
import productRouter from './product.routes';
import orderRouter from './order.routes';
import dataRouter from './data.routes';

const router = Router();

router.use('/categories', categoryRouter);
router.use('/brands', brandRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/import-data', dataRouter);

export default router;
