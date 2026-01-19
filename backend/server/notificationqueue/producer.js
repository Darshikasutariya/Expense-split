import { notificationQueue } from "./queue.js";
import { sendNotification } from "../services/notificationService.js";

export const sendNotificationJob = async ({
    user_id,
    type,
    title,
    message,
    data = {},
    relatedTo = {},
    actionUrl = '',
    sendPush = true,
    sendEmail = false
}) => {
    console.log("Notification job added to queue");
    if (!notificationQueue) {
        console.warn("Queue not available. Sending notification directly.");
        return await sendNotification({
            user_id,
            type,
            title,
            message,
            data,
            relatedTo,
            actionUrl,
            sendPush,
            sendEmail
        });
    }

    try {
        await notificationQueue.add(
            "send-notification",
            {
                user_id,
                type,
                title,
                message,
                data,
                relatedTo,
                actionUrl,
                sendPush,
                sendEmail
            },
            {
                jobId: `notification:${user_id}:${Date.now()}`
            }
        );

        console.log("Notification job added to queue");
    } catch (error) {
        console.warn("Failed to add job to queue. Sending notification directly.", error.message);

        return await sendNotification({
            user_id,
            type,
            title,
            message,
            data,
            relatedTo,
            actionUrl,
            sendPush,
            sendEmail
        });
    }
};

