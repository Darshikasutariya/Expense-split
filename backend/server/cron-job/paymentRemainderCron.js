import cron from "node-cron";
import Payment from "../models/paymentSchema.js";
import { notifyPaymentPending } from "../helpers/notificationHelpers.js";

cron.schedule("0 0 */15 * *", async () => {
    console.log("Payment cron job running");
    const now = new Date();
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    try {
        // Find pending payments older than 15 days
        const pendingPayments = await Payment.find({
            status: "pending",
            createdAt: { $lte: fifteenDaysAgo }
        })
            .populate('user_id', 'name email')
            .populate('toUser_id', 'name email')
            .populate('group_id', 'groupName');

        if (pendingPayments.length > 0) {
            console.log(`Found ${pendingPayments.length} pending payments`);

            // Send pending payment notifications
            for (const payment of pendingPayments) {
                const fromUser = payment.user_id;
                const toUser = payment.toUser_id;

                if (fromUser && toUser) {
                    notifyPaymentPending(payment, fromUser, toUser).catch(err =>
                        console.error('Payment pending notification failed:', err)
                    );
                }
            }

            console.log(`Sent pending notifications to ${pendingPayments.length} users`);
        } else {
            console.log('No pending payments found');
        }
    } catch (error) {
        console.error('Payment cron job error:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

