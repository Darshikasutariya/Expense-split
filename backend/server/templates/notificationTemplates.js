export const notificationMessages = {
    // Expense notifications
    new_expense: (data) => ({
        title: `New expense: ${data.expenseTitle}`,
        message: `${data.paidBy} added ₹${data.amount} in ${data.groupName}`,
        data: {
            type: 'new_expense',
            expenseId: data.expenseId,
            groupId: data.groupId,
            amount: data.amount
        }
    }),

    expense_updated: (data) => ({
        title: `Expense updated: ${data.expenseTitle}`,
        message: `Amount changed to ₹${data.amount} in ${data.groupName}`,
        data: {
            type: 'expense_updated',
            expenseId: data.expenseId,
            groupId: data.groupId,
            amount: data.amount
        }
    }),

    expense_deleted: (data) => ({
        title: `Expense deleted: ${data.expenseTitle}`,
        message: `${data.deletedBy} removed this expense from ${data.groupName}`,
        data: {
            type: 'expense_deleted',
            groupId: data.groupId
        }
    }),

    // Settlement notifications
    settlement_received: (data) => ({
        title: `Payment received: ₹${data.amount}`,
        message: `${data.fromUserName} paid you ₹${data.amount} via ${data.paymentMethod}`,
        data: {
            type: 'settlement_received',
            settlementId: data.settlementId,
            amount: data.amount,
            fromUserId: data.fromUserId
        }
    }),

    settlement_completed: (data) => ({
        title: `Settlement confirmed`,
        message: `Your ₹${data.amount} payment to ${data.toUserName} has been recorded`,
        data: {
            type: 'settlement_completed',
            settlementId: data.settlementId,
            amount: data.amount,
            toUserId: data.toUserId
        }
    }),

    // Friend notifications
    friend_request: (data) => ({
        title: `New friend request`,
        message: `${data.fromUserName} wants to add you as a friend`,
        data: {
            type: 'friend_request',
            friendRequestId: data.friendRequestId,
            fromUserId: data.fromUserId
        }
    }),

    friend_accepted: (data) => ({
        title: `Friend request accepted`,
        message: `${data.friendName} accepted your friend request`,
        data: {
            type: 'friend_accepted',
            friendId: data.friendId,
            userId: data.userId
        }
    }),

    // Group notifications
    group_invitation: (data) => ({
        title: `Group invitation: ${data.groupName}`,
        message: `${data.invitedBy} invited you to join ${data.groupName}`,
        data: {
            type: 'group_invitation',
            groupId: data.groupId,
            inviterId: data.inviterId
        }
    }),

    // Payment reminder
    payment_reminder: (data) => ({
        title: `You have pending balances`,
        message: `You owe ₹${data.totalOwed} across ${data.groupCount} groups`,
        data: {
            type: 'payment_reminder',
            totalOwed: data.totalOwed
        }
    }),

    // Payment notifications
    payment_success: (data) => ({
        title: `Payment successful`,
        message: `₹${data.amount} payment to ${data.toUserName} was successful`,
        data: {
            type: 'payment_success',
            paymentId: data.paymentId,
            amount: data.amount
        }
    }),

    payment_failed: (data) => ({
        title: `Payment failed`,
        message: `₹${data.amount} payment could not be processed. ${data.reason}`,
        data: {
            type: 'payment_failed',
            paymentId: data.paymentId,
            amount: data.amount,
            reason: data.reason
        }
    })
};

// Get formatted notification by type
export const getNotificationTemplate = (type, data) => {
    const template = notificationMessages[type];
    if (!template) {
        throw new Error(`Unknown notification type: ${type}`);
    }
    return template(data);
};

