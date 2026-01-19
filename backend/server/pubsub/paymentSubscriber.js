import redis from "../config/redis.js";
import { handlePaymentCompleted, handlePaymentFailed } from "../controllers/paymentController.js";

const subscriber = redis.duplicate();

subscriber.subscribe("payment:completed", "payment:failed", (error) => {
    if (error) {
        console.error("Failed to subscribe to payment channels:", error.message);
        return;
    }
});

subscriber.on('message', async (channel, message) => {
    try {
        const payload = JSON.parse(message);

        if (channel === 'payment:completed') {
            console.log('Received payment:completed event');

            // Resolve pending promise if exists
            const requestId = payload.data?.requestId;
            if (requestId && global.paymentResolvers?.[requestId]) {
                global.paymentResolvers[requestId]({
                    success: true,
                    paymentId: payload.data.paymentId,
                    paymentIntentId: payload.data.paymentIntentId,
                    status: payload.data.status
                });
            }

            await handlePaymentCompleted(payload);
        } else if (channel === 'payment:failed') {
            console.log('Received payment:failed event');

            // Resolve pending promise if exists
            const requestId = payload.data?.requestId;
            if (requestId && global.paymentResolvers?.[requestId]) {
                global.paymentResolvers[requestId]({
                    success: false,
                    error: payload.data.error || 'Payment failed'
                });
            }

            await handlePaymentFailed(payload);
        } else {
            console.warn(`Unknown channel: ${channel}`);
        }
    } catch (error) {
        console.error('Error processing payment event:', error);
    }
});

subscriber.on('error', (err) => {
    console.error('Redis subscriber error:', err);
});

subscriber.on('connect', () => {
    console.log('Payment subscriber connected to Redis');
});

export default subscriber;
