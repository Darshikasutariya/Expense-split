import cron from "node-cron";
import Friend from "../models/friendSchema.js";

cron.schedule("0 0 * * *", async () => {
    console.log("Friend cron job running");

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    // const sevenDaysAgo = new Date(now.getTime() - 60 * 1);

    try {
        console.log("Friend cron job running");
        const result = await Friend.updateMany(
            {
                status: "pending",
                createdAt: { $lte: sevenDaysAgo },
                expiredAt: { $exists: false }
            },
            { $set: { expiredAt: now } }
        );
        console.log("Friend cron:", result.modifiedCount, "pending requests expired");
    } catch (err) {
        console.error("Friend cron error:", err);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

