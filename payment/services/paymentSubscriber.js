import redis from "../config/redis.js";
import { processStripePayment } from './stripeService.js';
import { publishPaymentCompleted, publishPaymentFailed } from './paymentPublisher.js';

const subscriber = redis.duplicate();

subscriber.subscribe("payment:request", (error, count) => {
    if (error) {
        console.error("Failed to subscribe to payment request channel:", error.message);
        return;
    }
});

subscriber.on('message', async (channel, message) => {
    if (channel === 'payment:request') {
        try {
            const paymentData = JSON.parse(message);
            console.log('Received payment request:', paymentData);

            const { requestId, user_id, toUser_id, amount, paymentMethod, group_id, friend_id } = paymentData;

            // Process payment via Stripe
            const result = await processStripePayment({
                user_id,
                toUser_id,
                amount,
                paymentMethod,
                group_id,
                friend_id
            });

            if (result.success) {
                console.log('Payment processed successfully, publishing completion event');
                await publishPaymentCompleted({
                    requestId,  // Pass requestId through
                    user_id,
                    toUser_id,
                    amount,
                    group_id,
                    friend_id,
                    paymentMethod,
                    paymentId: result.data.paymentId,
                    paymentIntentId: result.data.paymentIntentId,
                    status: result.data.status
                });
            } else {
                console.log('Payment failed, publishing failure event');
                await publishPaymentFailed({
                    requestId,  // Pass requestId through
                    user_id,
                    toUser_id,
                    amount,
                    group_id,
                    friend_id,
                    paymentMethod,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error processing payment request:', error);
        }
    }
});

export default subscriber;