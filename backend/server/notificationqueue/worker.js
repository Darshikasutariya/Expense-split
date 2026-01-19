import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { sendNotification } from "../services/notificationService.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

await connectDB();
console.log("MongoDB connected(Worker)");

let notificationWorker;

try {
    if (redis.status === 'ready' || redis.status === 'connect') {
        notificationWorker = new Worker(
            "notification-queue",
            async (job) => {
                console.log(`Processing job ${job.id}`);

                try {
                    const { user_id, type, title, message, data, relatedTo, actionUrl, sendPush, sendEmail } = job.data;

                    const result = await sendNotification({
                        user_id,
                        type,
                        title,
                        message,
                        data,
                        relatedTo,
                        actionUrl,
                        sendPush: sendPush !== undefined ? sendPush : true,
                        sendEmail: sendEmail !== undefined ? sendEmail : false
                    });

                    console.log(`Notification sent to user ${user_id}:`, result);
                    return result;
                } catch (error) {
                    console.error(`Error processing job ${job.id}:`, error);
                    throw error;
                }
            },
            {
                connection: redis,
                concurrency: 5
            }
        );

        notificationWorker.on("failed", (job, err) => {
            console.error(`Job ${job.id} failed after all retries:`, err.message);
        });

        notificationWorker.on("completed", (job) => {
            console.log(`Job ${job.id} completed successfully`);
        });

        console.log("Notification worker started successfully");
    } else {
        console.warn("Redis not available. Notification worker not started. Notifications will be sent directly.");
    }
} catch (error) {
    console.warn("Failed to start notification worker:", error.message);
    notificationWorker = null;
}

export default notificationWorker;
