import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { parse, format, eachDayOfInterval, startOfDay, endOfDay, isValid } from 'date-fns';
import { PipelineStage } from 'mongoose';

interface DateStats {
  date: string;
  totalOrders: number;
  totalRevenue: number;
}

interface AggregationResult {
  date: string;
  totalOrders: number;
  totalRevenue: number;
}
interface ProductStat {
  _id: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  image: string;
  price: number;
}

export const totalStats = async (req: Request, res: Response, next: NextFunction) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  // Đếm tổng số đơn hàng, loại trừ đơn hàng đã hủy
  const totalOrders = await Order.countDocuments({ orderStatus: { $ne: 'cancelled' } });

  // Tính tổng doanh thu từ các đơn hàng thành công
  const totalRevenue = await Order.aggregate([
    {
      $match: { orderStatus: 'done' },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalPrice' },
      },
    },
  ]).then((result) => result[0]?.total || 0);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
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
  const pipeline: PipelineStage[] = [
    {
      $match: {
        orderStatus: { $ne: 'cancelled' }, // Loại bỏ đơn hàng bị hủy
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
        },
        totalOrders: { $sum: 1 },
        totalRevenue: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'done'] }, '$totalPrice', 0],
          },
        },
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
  ];

  const data = await Order.aggregate(pipeline);
  return data;
};

export const findTop5Buyers = async (req: Request, res: Response, next: NextFunction) => { };

export const orderByDateRangeStats = async (startDate: string, endDate: string): Promise<DateStats[]> => {
  const parseDate = (dateString: string): moment.Moment => {
    const parsedDate = moment(dateString, 'DD-MM-YYYY');
    if (!parsedDate.isValid()) {
      throw new Error('Ngày không hợp lệ. Vui lòng sử dụng định dạng DD-MM-YYYY.');
    }
    return parsedDate;
  };

  // Chuyển đổi thời gian địa phương sang UTC
  const start = parseDate(startDate).startOf('day').subtract(7, 'hours').toDate();
  const end = parseDate(endDate).endOf('day').subtract(7, 'hours').toDate();

  const aggregationPipeline: PipelineStage[] = [
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        orderStatus: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: { $add: ['$createdAt', 7 * 60 * 60 * 1000] }, // Thêm 7 giờ để chuyển về múi giờ Việt Nam
          },
        },
        totalOrders: { $sum: 1 },
        totalRevenue: {
          $sum: {
            $cond: [{ $eq: ['$orderStatus', 'done'] }, '$totalPrice', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        totalOrders: 1,
        totalRevenue: 1,
      },
    },
    { $sort: { date: 1 } },
  ];

  const data: AggregationResult[] = await Order.aggregate(aggregationPipeline);

  const allDates: DateStats[] = [];
  const currentDate = moment(start).add(7, 'hours');
  const lastDate = moment(end).add(7, 'hours');

  while (currentDate <= lastDate) {
    const dateString = currentDate.format('DD-MM-YYYY');
    const existingStat = data.find((s) => moment(s.date).format('DD-MM-YYYY') === dateString) || {
      totalOrders: 0,
      totalRevenue: 0,
    };
    allDates.push({
      date: dateString,
      totalOrders: existingStat.totalOrders,
      totalRevenue: existingStat.totalRevenue,
    });
    currentDate.add(1, 'days');
  }

  return allDates;
};

export const getProductStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    const parseDate = (dateString: string): Date => {
      const parsedDate = moment(dateString, 'DD-MM-YYYY');
      if (!parsedDate.isValid()) {
        throw new Error('Invalid date. Please use DD-MM-YYYY format.');
      }
      return parsedDate.toDate();
    };

    // Convert local time to UTC
    const start = moment(parseDate(startDate as string))
      .startOf('day')
      .subtract(7, 'hours')
      .toDate();
    const end = moment(parseDate(endDate as string))
      .endOf('day')
      .subtract(7, 'hours')
      .toDate();

    const pipeline: PipelineStage[] = [
      // Match orders within the date range and only 'done' status
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          orderStatus: 'done',
        },
      },
      // Unwind to process each item in the items array
      { $unwind: '$items' },
      // Group by product
      {
        $group: {
          _id: '$items._id',
          name: { $first: '$items.name' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          image: { $first: '$items.image' },
          price: { $first: '$items.price' },
        },
      },
      // Sort by totalQuantity to get top/bottom
      { $sort: { totalQuantity: -1 } },
    ];

    const allProductStats: ProductStat[] = await Order.aggregate(pipeline);

    // Get top 5 best-selling products
    const topSellingProducts = allProductStats.slice(0, 5);

    // Get top 5 least-selling products
    const leastSellingProducts = allProductStats.slice(-5).reverse();

    // Get total number of products to calculate percentage
    const totalProducts = await Product.countDocuments({ isDeleted: false, isHide: false });

    // Add percentage information to the results
    const addPercentage = (products: ProductStat[]) => {
      return products.map((product) => ({
        ...product,
        percentageOfTotal: ((product.totalQuantity / totalProducts) * 100).toFixed(2),
      }));
    };

    return {
      topSellingProducts: addPercentage(topSellingProducts),
      leastSellingProducts: addPercentage(leastSellingProducts),
      dateRange: {
        start: moment(start).add(7, 'hours').format('DD-MM-YYYY'),
        end: moment(end).add(7, 'hours').format('DD-MM-YYYY'),
      },
    };
  } catch (error) {
    next(error);
  }
};
