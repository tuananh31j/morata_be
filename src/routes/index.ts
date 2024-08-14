import { Router } from 'express';
import categoryRouter from './category.routes';
import brandRouter from './brand.routes';
import productRouter from './product.routes';
import cartRouter from './cart.routes';
import checkoutRouter from './checkout.routes';
import orderRouter from './order.routes';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import locationRouter from './location.routes';
import reviewRouter from './review.routes';
import statsRouter from './stats.routes';
import attributeRouter from './attribute.routes';
import shippingRouter from './shipping.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/users', userRouter);
router.use('/locations', locationRouter);
router.use('/categories', categoryRouter);
router.use('/brands', brandRouter);
router.use('/reviews', reviewRouter);
router.use('/carts', cartRouter);
router.use('/shipping', shippingRouter);
router.use(checkoutRouter);
router.use('/orders', orderRouter);
router.use('/stats', statsRouter);
router.use('/attributes', attributeRouter);

export default router;
