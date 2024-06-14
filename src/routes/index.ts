import { Router } from 'express';
import categoryRouter from './category.routes';
import brandRouter from './brand.routes';
import productRouter from './product.routes';
import cartRouter from './cart.routes';
import checkoutRouter from './checkout.routes';
import orderRouter from './order.routes';
import authRouter from './auth.routes';
import reviewRouter from './review.routes';
import attributeRouter from './attribute.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/categories', categoryRouter);
router.use('/attributes', attributeRouter);
router.use('/brands', brandRouter);
router.use('/products', productRouter);
router.use('/reviews', reviewRouter);
router.use('/carts', cartRouter);
router.use(checkoutRouter);
router.use('/orders', orderRouter);

export default router;
