import { brands, categories, products } from '@/data';
import { Brand, Category, Product } from '@/models';
import { NextFunction, Request, Response } from 'express';

export const generateData = async (req: Request, res: Response, next: NextFunction) => {
  await Category.deleteMany();
  await Brand.deleteMany();
  await Product.deleteMany();

  await Category.insertMany([...categories]);
  await Brand.insertMany([...brands]);
  await Product.insertMany([...products]);

  return res.status(200).json({ message: 'Imported data!' });
};
