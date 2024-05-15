import { Router } from 'express';
import categoryRouter from './category.routes';
import brandRouter from './brand.routes';
import productRouter from './product.routes';
import cartRouter from './cart.routes';
import orderRouter from './order.routes';
import attributeRouter from './attribute.routes';
import authRouter from './auth.routes';
import dataRouter from './data.routes';

const router = Router();

// router.get('/', (req, res) => res.send('Welcome to Morata APIs'));
router.use('/categories', categoryRouter);
router.use('/brands', brandRouter);
router.use('/products', productRouter);
router.use('/carts', cartRouter);
router.use('/orders', orderRouter);
router.use('/attributes', attributeRouter);
router.use('/auth', authRouter);
router.use('/import-data', dataRouter);

export default router;
