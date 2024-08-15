import Order from '@/models/Order';
import Product from '@/models/Product';
import ProductVariation from '@/models/ProductVariation';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';

export const totalStats = async (req: Request, res: Response, next: NextFunction) => {
    const { dateFilter, startDate, endDate, month, year } = req.query;

    let start: Date, end: Date;

    if (dateFilter === 'range' && startDate && endDate) {
        start = moment(startDate as string, 'DD-MM-YYYY')
            .startOf('day')
            .toDate();
        end = moment(endDate as string, 'DD-MM-YYYY')
            .endOf('day')
            .toDate();
    } else if (month && year) {
        start = moment(`01-${month}-${year}`, 'DD-MM-YYYY').startOf('day').toDate();
        end = moment(`01-${+month + 1}-${year}`, 'DD-MM-YYYY')
            .subtract(1, 'days')
            .endOf('day')
            .toDate();
    } else if (year) {
        start = moment(`01-01-${year}`, 'DD-MM-YYYY').startOf('day').toDate();
        end = moment(`31-12-${year}`, 'DD-MM-YYYY').endOf('day').toDate();
    } else if (dateFilter === 'single' && startDate) {
        start = moment(startDate as string, 'DD-MM-YYYY')
            .startOf('day')
            .toDate();
        end = moment(startDate as string, 'DD-MM-YYYY')
            .endOf('day')
            .toDate();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid date filter' });
    }

    const [totalOrders, cancelledOrders, totalRevenue, newUsers, newProducts] = await Promise.all([
        Order.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        Order.countDocuments({ createdAt: { $gte: start, $lte: end }, orderStatus: 'cancelled' }),
        Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end },
                    orderStatus: 'done',
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' },
                    count: { $sum: 1 },
                },
            },
        ]).then((result) => ({ total: result[0]?.total || 0, count: result[0]?.count || 0 })),
        User.countDocuments({ createdAt: { $gte: start, $lte: end } }),
        Product.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    ]);

    const successfulOrders = totalRevenue.count;

    // Tính các tỷ lệ
    const orderSuccessRate = totalOrders > 0 ? (successfulOrders / totalOrders) * 100 : 0;
    const orderCancelRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

    // Tính trung bình doanh thu mỗi ngày
    const daysDiff = moment(end).diff(moment(start), 'days') + 1;
    const averageDailyRevenue = totalRevenue.total / daysDiff;

    return {
        data: {
            totalOrders,
            cancelledOrders,
            successfulOrders,
            totalRevenue: totalRevenue.total,
            orderSuccessRate: parseFloat(orderSuccessRate.toFixed(2)),
            orderCancelRate: parseFloat(orderCancelRate.toFixed(2)),
            newUsers,
            newProducts,
            averageDailyRevenue: parseFloat(averageDailyRevenue.toFixed(2)),
            dateRange: {
                start: moment(start).format('YYYY-MM-DD'),
                end: moment(end).format('YYYY-MM-DD'),
            },
        },
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
    const { year } = req.query;

    if (!year) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Year is required' });
    }

    const startDate = moment(`01-01-${year as string}`, 'DD-MM-YYYY')
        .startOf('day')
        .toDate();
    const endDate = moment(`31-12-${year as string}`, 'DD-MM-YYYY')
        .endOf('day')
        .toDate();

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                orderStatus: 'done',
                isPaid: true,
            },
        },
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
                month: {
                    $arrayElemAt: [
                        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        { $subtract: ['$_id.month', 1] },
                    ],
                },
                year: '$_id.year',
                totalOrders: 1,
                totalRevenue: 1,
            },
        },
        {
            $sort: { '_id.month': 1 },
        },
    ]);

    // Tạo mảng đầy đủ 12 tháng
    const fullYearData = Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        year: parseInt(year as string),
        totalOrders: 0,
        totalRevenue: 0,
    }));

    // Merge dữ liệu thực tế vào mảng đầy đủ
    data.forEach((item) => {
        const index = fullYearData.findIndex((d) => d.month === item.month);
        if (index !== -1) {
            fullYearData[index] = item;
        }
    });

    return fullYearData;
};

export const orderByYearStats = async (req: Request, res: Response, next: NextFunction) => {
    const { year } = req.query;

    if (!year) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Year is required' });
    }

    const start = moment(`01-01-${year}`, 'DD-MM-YYYY').startOf('day').toDate();
    const end = moment(`31-12-${year}`, 'DD-MM-YYYY').endOf('day').toDate();

    const pipeline: any[] = [
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                orderStatus: { $ne: 'cancelled' }, // Loại bỏ đơn hàng bị hủy
            },
        },
        {
            $group: {
                _id: {
                    month: { $month: '$createdAt' },
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
                month: '$_id.month',
                totalOrders: 1,
                totalRevenue: 1,
            },
        },
        {
            $sort: { month: 1 },
        },
    ];

    const data = await Order.aggregate(pipeline);

    // Tính tổng số đơn hàng và tổng doanh thu cho cả năm
    const totalOrders = data.reduce((acc, curr) => acc + curr.totalOrders, 0);
    const totalRevenue = data.reduce((acc, curr) => acc + curr.totalRevenue, 0);

    return {
        data: {
            year: parseInt(year as string, 10),
            months: data,
            totalOrders,
            totalRevenue,
        },
    };
};
export const orderByDateRangeStats = async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;

    let start: Date, end: Date;

    if (startDate && endDate) {
        start = moment(startDate as string, 'DD-MM-YYYY')
            .startOf('day')
            .toDate();
        end = moment(endDate as string, 'DD-MM-YYYY')
            .endOf('day')
            .toDate();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid date range' });
    }

    const pipeline: any[] = [
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
                        date: '$createdAt',
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

    const data = await Order.aggregate(pipeline);

    const allDates = [];
    const currentDate = moment(start);
    const lastDate = moment(end);

    while (currentDate <= lastDate) {
        const dateString = currentDate.format('DD-MM-YYYY');
        const existingStat = data.find((s) => s.date === currentDate.format('YYYY-MM-DD')) || {
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
    const { startDate, endDate } = req.query;

    let start: Date, end: Date;

    if (startDate && endDate) {
        start = moment(startDate as string, 'DD-MM-YYYY')
            .startOf('day')
            .toDate();
        end = moment(endDate as string, 'DD-MM-YYYY')
            .endOf('day')
            .toDate();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid date range' });
    }

    const pipeline: any[] = [
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                orderStatus: 'done',
            },
        },
        { $unwind: '$items' },
        {
            $group: {
                _id: '$items.productId',
                name: { $first: '$items.name' },
                totalQuantity: { $sum: '$items.quantity' },
                totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                image: { $first: '$items.image' },
                price: { $first: '$items.price' },
            },
        },
        { $sort: { totalQuantity: -1 } },
    ];

    const allProductStats = await Order.aggregate(pipeline);

    // Get top 5 best-selling products
    const topSellingProducts = allProductStats.slice(0, 5);

    // Get top 5 least-selling products
    const leastSellingProducts = allProductStats.slice(-5).reverse();

    // Get total stock of all product variations
    const totalStock = await ProductVariation.aggregate([
        {
            $group: {
                _id: null,
                totalStock: { $sum: '$stock' },
            },
        },
    ]);

    const totalStockValue = totalStock[0]?.totalStock || 0;

    // Function to add percentage information
    const addPercentage = async (products: any[]) => {
        return Promise.all(
            products.map(async (product) => {
                const productVariations = await ProductVariation.find({ productId: product._id });
                const productTotalStock = productVariations.reduce((sum, variation) => sum + (variation.stock ?? 0), 0);
                return {
                    ...product,
                    percentageOfTotal: ((product.totalQuantity / productTotalStock) * 100).toFixed(2),
                    percentageOfAllProducts: ((productTotalStock / totalStockValue) * 100).toFixed(2),
                };
            }),
        );
    };

    const topSellingWithPercentage = await addPercentage(topSellingProducts);
    const leastSellingWithPercentage = await addPercentage(leastSellingProducts);

    return {
        data: {
            topSellingProducts: topSellingWithPercentage,
            leastSellingProducts: leastSellingWithPercentage,
            dateRange: {
                start: moment(start).format('DD-MM-YYYY'),
                end: moment(end).format('DD-MM-YYYY'),
            },
        },
    };
};
export const findTop5Buyers = async (req: Request, res: Response, next: NextFunction) => {
    const { dateFilter, startDate, endDate, month, year } = req.query;

    let start: Date, end: Date;

    if (dateFilter === 'range' && startDate && endDate) {
        start = moment(startDate as string, 'DD-MM-YYYY')
            .startOf('day')
            .toDate();
        end = moment(endDate as string, 'DD-MM-YYYY')
            .endOf('day')
            .toDate();
    } else if (month && year) {
        start = moment(`01-${month}-${year}`, 'DD-MM-YYYY').startOf('day').toDate();
        end = moment(`01-${+month + 1}-${year}`, 'DD-MM-YYYY')
            .subtract(1, 'days')
            .endOf('day')
            .toDate();
    } else if (year) {
        start = moment(`01-01-${year}`, 'DD-MM-YYYY').startOf('day').toDate();
        end = moment(`31-12-${year}`, 'DD-MM-YYYY').endOf('day').toDate();
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid date filter' });
    }

    const pipeline: any[] = [
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                orderStatus: 'done',
                isPaid: true,
            },
        },
        {
            $group: {
                _id: '$userId',
                totalOrders: { $sum: 1 },
                totalSpent: { $sum: '$totalPrice' },
                totalItems: { $sum: { $sum: '$items.quantity' } },
                lastOrderDate: { $max: '$createdAt' },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo',
            },
        },
        {
            $unwind: '$userInfo',
        },
        {
            $project: {
                _id: 1,
                totalOrders: 1,
                totalSpent: 1,
                totalItems: 1,
                lastOrderDate: 1,
                name: '$userInfo.username',
                email: '$userInfo.email',
                phone: '$userInfo.phone',
                avatar: '$userInfo.avatar',
            },
        },
        {
            $sort: { totalSpent: -1 },
        },
        {
            $limit: 5,
        },
    ];

    const topBuyers = await Order.aggregate(pipeline);

    return {
        topBuyers,
        dateRange: {
            start: moment(start).format('DD-MM-YYYY'),
            end: moment(end).format('DD-MM-YYYY'),
        },
    };
};
