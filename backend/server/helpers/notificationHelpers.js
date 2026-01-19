import { sendNotification, sendBulkNotifications } from '../services/notificationService.js';
import User from '../models/userSchema.js';
import Group from '../models/groupSchema.js';
import Expense_Split from '../models/expense_splitSchema.js';
import Balance from '../models/balanceSchema.js';
import { sendNotificationJob } from '../notificationqueue/producer.js';

//helper functions
const getContextName = async (expense) => {
    if (expense.expense_type === 'group' && expense.group_id) {
        const group = await Group.findById(expense.group_id);
        return group?.groupName || 'Group';
    } else if (expense.expense_type === 'friend' && expense.friend_id) {
        return 'Friend Expense';
    }
    return 'Expense';
};

const calculateUserExpenseShare = async (expense, userId) => {
    const split = await Expense_Split.findOne({
        expense_id: expense._id,
        user_id: userId
    });
    const yourShare = split?.amount || 0;

    const userPaid = expense.paid_by.find(p =>
        p.user_id.toString() === userId.toString()
    );
    const youPaid = userPaid?.amount || 0;

    return {
        yourShare: (yourShare.toFixed(2)),
        youPaid: (youPaid.toFixed(2)),
        youOwe: Number(Math.max(0, yourShare - youPaid)).toFixed(2),
        youGet: Number(Math.max(0, youPaid - yourShare)).toFixed(2)
    };
};

const getRemainingBalance = async (settlement) => {
    const query = settlement.group_id
        ? {
            fromUser_id: settlement.fromUser_id,
            toUser_id: settlement.toUser_id,
            group_id: settlement.group_id
        }
        : {
            fromUser_id: settlement.fromUser_id,
            toUser_id: settlement.toUser_id,
            friend_id: settlement.friend_id
        };

    const balance = await Balance.findOne(query);
    return balance ? balance.amount.toFixed(2) : '0.00';
};

const filterMembersToNotify = (affectedMembers, excludeUserId) => {
    return affectedMembers.filter(
        member => member.user_id.toString() !== excludeUserId.toString()
    );
};

const batchFetchUsers = async (userIds) => {
    const users = await User.find({ _id: { $in: userIds } }).lean();
    return new Map(users.map(u => [u._id.toString(), u]));
};


// notification functions

export const notifyUserRegistered = async (user) => {
    try {
        const notificationPayload = {
            user_id: user._id,
            type: 'welcome',
            title: 'Welcome to Splitwise!',
            message: `Hi ${user.name}, welcome to Splitwise! Start splitting expenses with friends.`,
            data: {
                userName: user.name,
                email: user.email
            },
            actionUrl: '/dashboard',
            sendEmail: true
        };

        await sendNotificationJob(notificationPayload);
        console.log('Welcome notification sent to:', user.email);
    } catch (error) {
        console.error('Error sending welcome notification:', error);
    }
};

export const notifyFriendRequestSent = async (friendRequest, requester, receiver) => {
    try {
        await sendNotificationJob({
            user_id: receiver._id,
            type: 'friend_request_sent',
            title: 'New Friend Request',
            message: `${requester.name} sent you a friend request`,
            data: {
                userName: receiver.name,
                senderName: requester.name,
                senderEmail: requester.email,
                friendRequestId: friendRequest._id
            },
            relatedTo: {
                friend_id: friendRequest._id
            },
            actionUrl: `/friends/requests`,
            sendEmail: true
        });

        console.log('Friend request notification sent');
    } catch (error) {
        console.error('Error sending friend request notification:', error);
    }
};

export const notifyFriendRequestAccepted = async (friendRequest, accepter, requester) => {
    try {
        await sendNotificationJob({
            user_id: requester._id,
            type: 'friend_request_accepted',
            title: 'Friend Request Accepted',
            message: `${accepter.name} accepted your friend request`,
            data: {
                userName: requester.name,
                acceptedBy: accepter.name,
                friendId: friendRequest._id
            },
            relatedTo: {
                friend_id: friendRequest._id
            },
            actionUrl: `/friends/${friendRequest._id}`,
            sendEmail: true
        });

        console.log('Friend request accepted notification sent');
    } catch (error) {
        console.error('Error sending friend acceptance notification:', error);
    }
};

export const notifyFriendRequestRejected = async (friendRequest, rejector, requester) => {
    try {
        await sendNotificationJob({
            user_id: requester._id,
            type: 'friend_request_rejected',
            title: 'Friend Request Update',
            message: `${rejector.name} declined your friend request`,
            data: {
                userName: requester.name,
                rejectedBy: rejector.name
            },
            relatedTo: {
                friend_id: friendRequest._id
            },
            actionUrl: '/friends/search',
            sendEmail: false
        });

        console.log('Friend request rejected notification sent');
    } catch (error) {
        console.error('Error sending friend rejection notification:', error);
    }
};

export const notifyGroupMemberAdded = async (group, addedUsers, invitedBy) => {
    try {
        const notifications = addedUsers.map(user => ({
            user_id: user._id,
            type: 'group_invite',
            title: 'Group Invitation',
            message: `${invitedBy.name} added you to ${group.groupName}`,
            data: {
                userName: user.name,
                groupName: group.groupName,
                groupDescription: group.groupDescription || '',
                invitedBy: invitedBy.name,
                memberCount: group.stats?.memberCount || 0,
                groupId: group._id
            },
            relatedTo: {
                group_id: group._id
            },
            actionUrl: `/groups/${group._id}`,
            sendEmail: true
        }));

        // await sendBulkNotifications(notifications);
        for (const notification of notifications) {
            await sendNotificationJob(notification);
        }
        console.log('Group member added notifications sent');
    } catch (error) {
        console.error('Error sending group member notifications:', error);
    }
};

export const notifyGroupMemberRemoved = async (group, removedUser, removedBy) => {
    try {
        await sendNotification({
            user_id: removedUser._id,
            type: 'group_removed',
            title: 'Removed from Group',
            message: `You were removed from ${group.groupName}`,
            data: {
                userName: removedUser.name,
                groupName: group.groupName,
                removedBy: removedBy.name
            },
            relatedTo: {
                group_id: group._id
            },
            actionUrl: '/groups',
            sendEmail: false
        });

        console.log('Group member removed notification sent');
    } catch (error) {
        console.error('Error sending group removal notification:', error);
    }
};

export const notifyExpenseAdded = async (expense, createdByUser, affectedMembers) => {
    try {
        const contextName = await getContextName(expense);
        const membersToNotify = filterMembersToNotify(affectedMembers, createdByUser._id);

        const userIds = membersToNotify.map(m => m.user_id);
        const userMap = await batchFetchUsers(userIds);

        const notifications = [];

        for (const member of membersToNotify) {
            const memberUser = userMap.get(member.user_id.toString());
            if (!memberUser) continue;

            const shareInfo = await calculateUserExpenseShare(expense, member.user_id);

            notifications.push({
                user_id: member.user_id,
                type: 'expense_added',
                title: 'New Expense Added',
                message: `${createdByUser.name} added "${expense.title}" - Rs${expense.amount}`,
                data: {
                    userName: memberUser.name,
                    createdBy: createdByUser.name,
                    title: expense.title,
                    amount: expense.amount,
                    yourShare: shareInfo.yourShare,
                    category: expense.category || 'General',
                    groupName: contextName,
                    description: expense.description || '',
                    youOwe: shareInfo.youOwe,
                    youGet: shareInfo.youGet,
                    expenseId: expense._id,
                    createdAt: expense.createdAt
                },
                relatedTo: {
                    expense_id: expense._id,
                    group_id: expense.group_id,
                    friend_id: expense.friend_id
                },
                actionUrl: `/expenses/${expense._id}`,
                sendEmail: true
            });
        }

        if (notifications.length > 0) {
            // await sendBulkNotifications(notifications);
            for (const notification of notifications) {
                await sendNotificationJob(notification);
            }
            console.log(`Expense added notifications sent to ${notifications.length} users`);
        }
    } catch (error) {
        console.error('Error sending expense added notifications:', error);
    }
};

export const notifyExpenseEdited = async (expense, editedByUser, affectedMembers, oldAmount) => {
    try {
        const contextName = await getContextName(expense);
        const membersToNotify = filterMembersToNotify(affectedMembers, editedByUser._id);

        const userIds = membersToNotify.map(m => m.user_id);
        const userMap = await batchFetchUsers(userIds);

        const notifications = [];

        for (const member of membersToNotify) {
            const memberUser = userMap.get(member.user_id.toString());
            if (!memberUser) continue;

            const shareInfo = await calculateUserExpenseShare(expense, member.user_id);

            notifications.push({
                user_id: member.user_id,
                type: 'expense_edited',
                title: 'Expense Updated',
                message: `${editedByUser.name} updated "${expense.title}"`,
                data: {
                    userName: memberUser.name,
                    editedBy: editedByUser.name,
                    title: expense.title,
                    newAmount: expense.amount,
                    oldAmount: oldAmount,
                    yourShare: shareInfo.yourShare,
                    groupName: contextName,
                    expenseId: expense._id
                },
                relatedTo: {
                    expense_id: expense._id,
                    group_id: expense.group_id,
                    friend_id: expense.friend_id
                },
                actionUrl: `/expenses/${expense._id}`,
                sendEmail: true
            });
        }

        if (notifications.length > 0) {
            // await sendBulkNotifications(notifications);
            for (const notification of notifications) {
                await sendNotificationJob(notification);
            }
            console.log(`Expense edited notifications sent to ${notifications.length} users`);
        }
    } catch (error) {
        console.error('Error sending expense edited notifications:', error);
    }
};

export const notifyExpenseDeleted = async (expense, deletedByUser, affectedMembers) => {
    try {
        const contextName = await getContextName(expense);
        const membersToNotify = filterMembersToNotify(affectedMembers, deletedByUser._id);

        const userIds = membersToNotify.map(m => m.user_id);
        const userMap = await batchFetchUsers(userIds);

        const notifications = [];

        for (const member of membersToNotify) {
            const memberUser = userMap.get(member.user_id.toString());
            if (!memberUser) continue;

            const memberSplit = await Expense_Split.findOne({
                expense_id: expense._id,
                user_id: member.user_id
            });

            const yourShare = memberSplit ? memberSplit.amount.toFixed(2) : '0.00';

            notifications.push({
                user_id: member.user_id,
                type: 'expense_deleted',
                title: 'Expense Deleted',
                message: `${deletedByUser.name} deleted "${expense.title}"`,
                data: {
                    userName: memberUser.name,
                    deletedBy: deletedByUser.name,
                    title: expense.title,
                    amount: expense.amount,
                    yourShare: yourShare,
                    groupName: contextName,
                    groupId: expense.group_id
                },
                relatedTo: {
                    group_id: expense.group_id,
                    friend_id: expense.friend_id
                },
                actionUrl: expense.group_id ? `/groups/${expense.group_id}` : '/expenses',
                sendEmail: false
            });
        }

        if (notifications.length > 0) {
            // await sendBulkNotifications(notifications);
            for (const notification of notifications) {
                await sendNotificationJob(notification);
            }
            console.log(`Expense deleted notifications sent to ${notifications.length} users`);
        }
    } catch (error) {
        console.error('Error sending expense deleted notifications:', error);
    }
};

export const notifySettlementReceived = async (settlement, fromUser, toUser) => {
    try {
        const contextName = settlement.group_id
            ? (await Group.findById(settlement.group_id))?.groupName || 'Group'
            : 'Friend';

        const remainingBalance = await getRemainingBalance(settlement);

        await sendNotificationJob({
            user_id: toUser._id,
            type: 'settlement_received',
            title: 'Payment Received!',
            message: `${fromUser.name} paid you Rs${settlement.amount}`,
            data: {
                userName: toUser.name,
                fromUser: fromUser.name,
                amount: settlement.amount,
                paymentMethod: settlement.paymentMethod,
                groupName: contextName,
                friendName: contextName,
                remainingBalance: remainingBalance,
                settlementId: settlement._id,
                settledAt: settlement.settledAt || settlement.createdAt
            },
            relatedTo: {
                settlement_id: settlement._id,
                group_id: settlement.group_id,
                friend_id: settlement.friend_id
            },
            actionUrl: `/settlements/${settlement._id}`,
            sendEmail: true
        });

        console.log('Settlement received notification sent to:', toUser.name);
    } catch (error) {
        console.error('Error sending settlement notification:', error);
    }
};

export const notifySettlementCompleted = async (settlement, fromUser, toUser) => {
    try {
        const remainingBalance = await getRemainingBalance(settlement);

        await sendNotificationJob({
            user_id: fromUser._id,
            type: 'settlement_completed',
            title: 'Settlement Confirmed',
            message: `Your payment of Rs${settlement.amount} to ${toUser.name} has been recorded`,
            data: {
                userName: fromUser.name,
                toUser: toUser.name,
                amount: settlement.amount,
                paymentMethod: settlement.paymentMethod,
                transactionId: settlement.paymentDetails?.transactionId ||
                    settlement.paymentDetails?.upiId ||
                    settlement.paymentDetails?.referenceNumber || 'N/A',
                remainingBalance: remainingBalance,
                settlementId: settlement._id
            },
            relatedTo: {
                settlement_id: settlement._id,
                group_id: settlement.group_id,
                friend_id: settlement.friend_id
            },
            actionUrl: `/settlements/${settlement._id}`,
            sendEmail: false
        });

        console.log('Settlement completed notification sent to:', fromUser.name);
    } catch (error) {
        console.error('Error sending settlement completed notification:', error);
    }
};


export const notifyMultipleUsers = async (notifications) => {
    try {
        await sendBulkNotifications(notifications);
        console.log(`Bulk notifications sent to ${notifications.length} users`);
    } catch (error) {
        console.error('Error sending bulk notifications:', error);
    }
};

export const notifyPaymentPending = async (payment, fromUser, toUser) => {
    try {
        const contextName = payment.group_id
            ? (await Group.findById(payment.group_id))?.groupName || 'Group'
            : 'Friend';

        await sendNotificationJob({
            user_id: fromUser._id,
            type: 'payment_pending',
            title: 'Payment Pending',
            message: `Your payment of ₹${payment.amount} to ${toUser.name} is still pending`,
            data: {
                userName: fromUser.name,
                toUser: toUser.name,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod,
                groupName: contextName,
                createdAt: payment.createdAt,
                paymentId: payment._id
            },
            relatedTo: {
                payment_id: payment._id,
                group_id: payment.group_id,
                friend_id: payment.friend_id
            },
            actionUrl: `/payments/${payment._id}`,
            sendEmail: true
        });

        console.log('Payment pending notification sent to:', fromUser.name);
    } catch (error) {
        console.error('Error sending payment pending notification:', error);
    }
};



export default {
    notifyUserRegistered,
    notifyFriendRequestSent,
    notifyFriendRequestAccepted,
    notifyFriendRequestRejected,
    notifyGroupMemberAdded,
    notifyGroupMemberRemoved,
    notifyExpenseAdded,
    notifyExpenseEdited,
    notifyExpenseDeleted,
    notifySettlementReceived,
    notifySettlementCompleted,
    // notifyBalanceReminder,
    notifyMultipleUsers,
    notifyPaymentPending
};
