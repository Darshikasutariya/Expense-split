import redis from "../config/redis.js";

export const publishPaymentRequest = async (paymentData) => {
    try {
        // Send flat structure that payment server expects
        const payload = JSON.stringify({
            requestId: paymentData.requestId,
            user_id: paymentData.user_id,
            toUser_id: paymentData.toUser_id,
            amount: paymentData.amount,
            paymentMethod: paymentData.paymentMethod,
            group_id: paymentData.group_id || null,
            friend_id: paymentData.friend_id || null
        });

        await redis.publish('payment:request', payload);
        console.log('Published payment:request event');
        console.log('  User:', paymentData.user_id);
        console.log('  Amount: ₹', paymentData.amount);
        console.log('  Method:', paymentData.paymentMethod);

        return { success: true };
    } catch (error) {
        console.error('Failed to publish payment:request:', error.message);
        return { success: false, error: error.message };
    }
};
