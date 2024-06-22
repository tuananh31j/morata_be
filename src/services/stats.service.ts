import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';

export const statsCommon = async (req: Request, res: Response, next: NextFunction) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();

  return {
    totalUsers,
    totalOrders,
    totalProducts,
  };
};
