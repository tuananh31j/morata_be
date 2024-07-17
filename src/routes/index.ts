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
import detailRouter from './detail.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/details', detailRouter);
router.use('/users', userRouter);
router.use('/locations', locationRouter);
router.use('/categories', categoryRouter);
router.use('/brands', brandRouter);
router.use('/reviews', reviewRouter);
router.use('/carts', cartRouter);
router.use(checkoutRouter);
router.use('/orders', orderRouter);
router.use('/stats', statsRouter);

export default router;
