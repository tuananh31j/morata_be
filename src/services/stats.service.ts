import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export const totalStats = async (req: Request, res: Response, next: NextFunction) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();

  return {
    totalOrders,
    totalProducts,
    totalUsers,
  };
};

export const orderByDayStats = async (req: Request, res: Response, next: NextFunction) => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;

  if (req.query.year) {
    year = parseInt(req.query.year as string);
  }

  if (req.query.month) {
    month = parseInt(req.query.month as string);
  }

  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lt: new Date(`${year}-${month + 1}-01`),
        },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: '$createdAt' },
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
        },
        totalOrders: 1,
        totalRevenue: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);

  const stats = data.map((stat) => ({
    date: moment(stat.date).format('MMM DD'),
    totalOrders: stat.totalOrders,
    totalRevenue: stat.totalRevenue,
  }));

  return stats;
};

export const orderByMonthStats = async (req: Request, res: Response, next: NextFunction) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        year: '$_id.year',
        totalOrders: 1,
        totalRevenue: 1,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);

  const stats = data.map((stat) => ({
    month: moment(`${stat.year}-${stat.month}-01`).format('MMM'),
    totalOrders: stat.totalOrders,
    totalRevenue: stat.totalRevenue,
  }));

  return stats;
};

export const orderByYearStats = async (req: Request, res: Response, next: NextFunction) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
        },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        totalOrders: 1,
        totalRevenue: 1,
      },
    },
    {
      $sort: { year: 1 },
    },
  ]);
  return data;
};
