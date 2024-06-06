import { Router } from 'express';
import categoryRouter from './category.routes';
import brandRouter from './brand.routes';
import productRouter from './product.routes';
import cartRouter from './cart.routes';
import checkoutRouter from './checkout.routes';
import orderRouter from './order.routes';
import authRouter from './auth.routes';
import reviewRouter from './review.routes';

const router = Router();

router.use('/categories', categoryRouter);
router.use('/brands', brandRouter);
router.use('/products', productRouter);
router.use('/carts', cartRouter);
router.use(checkoutRouter);
router.use('/orders', orderRouter);
router.use('/auth', authRouter);
router.use('/reviews', reviewRouter);

export default router;
