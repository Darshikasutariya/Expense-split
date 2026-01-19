import Notification from '../models/notificationSchema.js';
import User from '../models/userSchema.js';
import emailService from './emailService.js';

// Create In-App Notification
const createInAppNotification = async (user_id, type, title, message, data, relatedTo, actionUrl) => {
    try {
        const notification = await Notification.create({
            user_id,
            type,
            title,
            message,
            data,
            relatedTo,
            actionUrl: actionUrl,
            sent_via: {
                inApp: true,
                push: false,
                email: false
            }
        });

        console.log('In-app notification created:', notification.type);
        return {
            success: true,
            notification
        };
    } catch (error) {
        console.error('Error creating in-app notification:', error);
        return { success: false, error: error.message };
    }
};

// Send  Notification (Email + In-App)
export const sendNotification = async ({
    user_id,
    type,
    title,
    message,
    data = {},
    relatedTo = {},
    actionUrl = '',

}) => {
    console.log("Notification sent");
    try {
        console.log(`Sending notification to user ${user_id} - Type: ${type}`);

        const user = await User.findById(user_id).select('name email notificationSettings');

        if (!user) {
            console.error('User not found:', user_id);
            return { success: false, error: 'User not found' };
        }

        const { push, email, inApp } = user.notificationSettings;

        if (push) {
            console.log("Push notification sent");
            // await sendPushNotification(user_id, type, title, message, data, relatedTo, actionUrl);
        }

        //inapp
        if (inApp) {
            await createInAppNotification(
                user_id, type, title, message, data, relatedTo, actionUrl
            );
        }

        // email
        if (email) {
            const emailData = {
                userName: user.name,
                userEmail: user.email,
                ...data
            };

            let emailResult;

            switch (type) {
                case 'welcome':
                    emailResult = await emailService.sendWelcomeEmail(user.email, emailData);
                    break;

                case 'friend_request_sent':
                    emailResult = await emailService.sendFriendRequestEmail(user.email, emailData);
                    break;

                case 'friend_request_accepted':
                    emailResult = await emailService.sendTemplateEmail(
                        user.email,
                        'Friend Request Accepted',
                        'friend_request_accepted',
                        emailData
                    );
                    break;

                case 'expense_added':
                    emailResult = await emailService.sendExpenseAddedEmail(user.email, emailData);
                    break;

                case 'expense_edited':
                    emailResult = await emailService.sendTemplateEmail(
                        user.email,
                        'Expense Updated',
                        'expense_edited',
                        emailData
                    );
                    break;

                case 'expense_deleted':
                    emailResult = await emailService.sendTemplateEmail(
                        user.email,
                        'Expense Deleted',
                        'expense_deleted',
                        emailData
                    );
                    break;

                case 'settlement_received':
                    emailResult = await emailService.sendSettlementReceivedEmail(user.email, emailData);
                    break;

                case 'settlement_completed':
                    emailResult = await emailService.sendTemplateEmail(
                        user.email,
                        'Settlement Confirmed',
                        'settlement_completed',
                        emailData
                    );
                    break;

                case 'group_invite':
                    emailResult = await emailService.sendGroupInviteEmail(user.email, emailData);
                    break;

                case 'payment_reminder':
                    emailResult = await emailService.sendPaymentReminderEmail(user.email, emailData);
                    break;

                default:
                    console.log('No specific email handler for type:', type);
                    emailResult = { success: false, reason: 'unknown_type' };
            }

            results.email = emailResult;
        }

        console.log('Notification sent successfully:', results);
        return { success: true, results };
    } catch (error) {
        console.error('Error sending notification:', error);
        return { success: false, error: error.message };
    }
};

// Send Bulk Notifications
export const sendBulkNotifications = async (notifications) => {
    try {
        const results = await Promise.allSettled(
            notifications.map(notif => sendNotification(notif))
        );

        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        const failed = results.length - successful;

        console.log(`Bulk notifications: ${successful} sent, ${failed} failed`);
        return { success: true, sent: successful, failed: failed, results };
    } catch (error) {
        console.error('Error sending bulk notifications:', error);
        return { success: false, error: error.message };
    }
};

export default {
    sendNotification,
    sendBulkNotifications
};
