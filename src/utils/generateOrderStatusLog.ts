import { ORDER_STATUS } from '@/constant/order';

const generateOrderStatusLog = ({
    statusChangedBy,
    orderStatus,
    reason = '',
}: {
    statusChangedBy: string;
    orderStatus: ORDER_STATUS;
    reason?: string;
}) => {
    const createAt = new Date();
    return {
        statusChangedBy,
        orderStatus,
        reason,
        createAt: createAt.toISOString(),
    };
};

export default generateOrderStatusLog;
