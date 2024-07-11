import { queueConfig } from '@/config/queue.config';
import { ORDER_STATUS } from '@/constant/order';
import Order from '@/models/Order';
import Queue from 'bull';

// Cron job to process updating the order status
const queue = new Queue('orderQueue', queueConfig);

export const addOrderToQueue = async () => {
  await queue.add(
    {},
    {
      repeat: {
        every: 1000 * 60 * 60,
      },
    },
  );
};

export const processOrderQueue = async () => {
  queue.process(async (job) => {
    const estimatedTime = new Date();
    estimatedTime.setDate(estimatedTime.getDate() - 3);

    console.log(`Estimated time: ${estimatedTime}`);

    const orders = await Order.find({
      orderStatus: ORDER_STATUS.DELIVERED,
      updatedAt: { $lt: estimatedTime },
    });
    console.log(`Processing queue (${orders.length})...`);
    if (orders.length) {
      orders.forEach(async (order) => {
        order.orderStatus = ORDER_STATUS.DONE;
        await order.save();
      });
      return Promise.resolve();
    }

    return Promise.resolve();
  });
};
