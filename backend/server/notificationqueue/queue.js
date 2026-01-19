import { Queue } from "bullmq";
import redis from "../config/redis.js";

let notificationQueue;

try {
    notificationQueue = new Queue("notification-queue", {
        connection: redis,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000
            },
            removeOnComplete: true,
            removeOnFail: false
        }
    });

    notificationQueue.on('error', (err) => {
        console.warn('Notification queue error:', err.message);
    });
} catch (error) {
    console.warn('Failed to initialize notification queue. Notifications will be sent directly.', error.message);
    notificationQueue = null;
}

export { notificationQueue };
