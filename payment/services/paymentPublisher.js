import redis from "../config/redis.js";
export const publishPaymentCompleted = async (paymentData) => {
    try {
        const payload = JSON.stringify({
            event: 'PAYMENT_COMPLETED',
            data: {
                requestId: paymentData.requestId,
                user_id: paymentData.user_id,
                toUser_id: paymentData.toUser_id,
                amount: paymentData.amount,
                group_id: paymentData.group_id,
                friend_id: paymentData.friend_id,
                paymentMethod: paymentData.paymentMethod,
                paymentId: paymentData.paymentId,
                paymentIntentId: paymentData.paymentIntentId,
                status: paymentData.status
            }
        });

        await redis.publish('payment:completed', payload);
        console.log('Published payment:completed event');
    } catch (error) {
        console.error('Failed to publish payment:completed:', error.message);
    }
};

export const publishPaymentFailed = async (paymentData) => {
    try {
        const payload = JSON.stringify({
            event: 'PAYMENT_FAILED',
            data: {
                requestId: paymentData.requestId,
                user_id: paymentData.user_id,
                toUser_id: paymentData.toUser_id,
                amount: paymentData.amount,
                group_id: paymentData.group_id,
                friend_id: paymentData.friend_id,
                paymentMethod: paymentData.paymentMethod,
                error: paymentData.error
            }
        });

        await redis.publish('payment:failed', payload);
        console.log('Published payment:failed event');
    } catch (error) {
        console.error('Failed to publish payment:failed:', error.message);
    }
};
