// Base Email Template
const getBaseTemplate = (content) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Splitwise Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', 'Helvetica', sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Splitwise</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Split expenses, not friendships</p>
            </div>
            
            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                ${content}
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 12px;">
                <p style="margin: 5px 0;">This is an automated message from Splitwise App</p>
                <p style="margin: 5px 0;">If you have any questions, please contact <a href="mailto:support@splitwise.com" style="color: #667eea; text-decoration: none;">support@splitwise.com</a></p>
                <p style="margin: 15px 0 5px 0;">
                    <a href="${process.env.FRONTEND_URL}" style="color: #667eea; text-decoration: none; margin: 0 10px;">Home</a> |
                    <a href="${process.env.FRONTEND_URL}/settings" style="color: #667eea; text-decoration: none; margin: 0 10px;">Settings</a> |
                    <a href="${process.env.FRONTEND_URL}/help" style="color: #667eea; text-decoration: none; margin: 0 10px;">Help</a>
                </p>
                <p style="margin: 15px 0 0 0; color: #999;">© 2025 Splitwise. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Button Component
const getButton = (text, url, color = '#667eea') => {
    return `
    <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: ${color}; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${text}
        </a>
    </div>
    `;
};

// Info Box Component
const getInfoBox = (items, borderColor = '#667eea') => {
    const itemsHTML = items.map(item => `
        <div style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
            <span style="color: #666; font-size: 14px;">${item.label}:</span>
            <span style="color: #333; font-weight: bold; font-size: 15px; margin-left: 10px;">${item.value}</span>
        </div>
    `).join('');

    return `
    <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid ${borderColor}; margin: 25px 0; border-radius: 4px;">
        ${itemsHTML}
    </div>
    `;
};

// EXPENSE TEMPLATES

export const expenseAddedTemplate = (data) => {
    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">New Expense Added</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            <strong>${data.createdBy}</strong> added a new expense in <strong>${data.groupName}</strong>
        </p>
        
        ${getInfoBox([
        { label: 'Expense Title', value: data.title },
        { label: 'Total Amount', value: `Rs${data.amount}` },
        { label: 'Category', value: data.category },
        {
            label: 'Date', value: new Date(data.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        }
    ], '#4CAF50')}
        
        ${data.description ? `
            <div style="background-color: #fff8e1; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Note:</strong> ${data.description}</p>
            </div>
        ` : ''}
        
        ${getButton('View Expense Details', `${process.env.FRONTEND_URL}/expenses/${data.expenseId}`)}
    `;

    return getBaseTemplate(content);
};

export const expenseEditedTemplate = (data) => {
    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Expense Updated</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            <strong>${data.editedBy}</strong> updated an expense in <strong>${data.groupName}</strong>
        </p>
        
        ${getInfoBox([
        { label: 'Expense Title', value: data.title },
        { label: 'New Amount', value: `Rs${data.newAmount}` },
        { label: 'Previous Amount', value: `Rs${data.oldAmount}` },
    ], '#FF9800')}
        
        ${getButton('View Updated Expense', `${process.env.FRONTEND_URL}/expenses/${data.expenseId}`, '#FF9800')}
    `;

    return getBaseTemplate(content);
};

export const expenseDeletedTemplate = (data) => {
    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Expense Deleted</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            <strong>${data.deletedBy}</strong> deleted an expense from <strong>${data.groupName}</strong>
        </p>
        
        ${getInfoBox([
        { label: 'Expense Title', value: data.title },
        { label: 'Amount', value: `Rs${data.amount}` },
    ], '#f44336')}
        
        ${getButton('View Group', `${process.env.FRONTEND_URL}/groups/${data.groupId}`, '#f44336')}
    `;

    return getBaseTemplate(content);
};

// SETTLEMENT TEMPLATES

export const settlementReceivedTemplate = (data) => {
    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Payment Received!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Great news! <strong>${data.fromUser}</strong> has settled an amount with you.
        </p>
        
        ${getInfoBox([
        { label: 'Amount Received', value: `Rs${data.amount}` },
        { label: 'Payment Method', value: data.paymentMethod },
        { label: 'Group/Friend', value: data.groupName || data.friendName },
        {
            label: 'Date', value: new Date(data.settledAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    ], '#2196F3')}
        
        ${data.remainingBalance > 0 ? `
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #1976d2; font-size: 15px;">
                    Remaining Balance: <strong style="font-size: 18px;">Rs${data.remainingBalance}</strong>
                </p>
            </div>
        ` : `
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #4CAF50; font-size: 16px; font-weight: bold;">
                    Fully Settled Up!
                </p>
            </div>
        `}
        
        ${getButton('View Settlement Details', `${process.env.FRONTEND_URL}/settlements/${data.settlementId}`, '#2196F3')}
    `;

    return getBaseTemplate(content);
};

export const settlementCompletedTemplate = (data) => {
    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Settlement Confirmed</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Your payment to <strong>${data.toUser}</strong> has been recorded successfully.
        </p>
        
        ${getInfoBox([
        { label: 'Amount Paid', value: `Rs${data.amount}` },
        { label: 'Payment Method', value: data.paymentMethod },
        { label: 'Paid To', value: data.toUser },
        { label: 'Transaction ID', value: data.transactionId || 'N/A' }
    ], '#4CAF50')}
        
        ${data.remainingBalance > 0 ? `
            <p style="color: #666; font-size: 15px; line-height: 1.6;">
                Remaining balance with ${data.toUser}: <strong style="color: #f44336;">Rs${data.remainingBalance}</strong>
            </p>
        ` : `
            <p style="color: #4CAF50; font-size: 16px; line-height: 1.6; font-weight: bold;">
                You're all settled up with ${data.toUser}!
            </p>
        `}
        
        ${getButton('View Receipt', `${process.env.FRONTEND_URL}/settlements/${data.settlementId}`, '#4CAF50')}
    `;

    return getBaseTemplate(content);
};

// FRIEND REQUEST TEMPLATES

export const friendRequestSentTemplate = (data) => {
    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">New Friend Request</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            <strong>${data.senderName}</strong> wants to connect with you on Splitwise!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #f5f5f5; padding: 20px; border-radius: 50%; margin-bottom: 15px;">
                <span style="font-size: 48px;">👤</span>
            </div>
            <h3 style="color: #333; margin: 10px 0;">${data.senderName}</h3>
            <p style="color: #666; margin: 5px 0;">${data.senderEmail}</p>
        </div>
        
        ${data.message ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #FF9800;">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Message:</strong></p>
                <p style="margin: 10px 0 0 0; color: #333; font-size: 15px;">"${data.message}"</p>
            </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/friends/accept/${data.friendRequestId}" 
               style="display: inline-block; padding: 14px 32px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 0 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                Accept
            </a>
            <a href="${process.env.FRONTEND_URL}/friends/reject/${data.friendRequestId}" 
               style="display: inline-block; padding: 14px 32px; background-color: #f44336; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 0 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                Decline
            </a>
        </div>
    `;

    return getBaseTemplate(content);
};

export const friendRequestAcceptedTemplate = (data) => {
    const userName = data.userName || data.name || 'there';
    const acceptedBy = data.acceptedBy || 'Someone';

    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Friend Request Accepted</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Great news! <strong>${acceptedBy}</strong> accepted your friend request.
        </p>
        
        <div style="background-color: #e8f5e9; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0;">
            <span style="font-size: 64px; margin-bottom: 15px; display: block;">🤝</span>
            <p style="margin: 0; color: #4CAF50; font-size: 18px; font-weight: bold;">
                You're now connected!
            </p>
        </div>
        
        <p style="color: #666; font-size: 15px; line-height: 1.6;">
            You can now split expenses and settle up with ${acceptedBy}.
        </p>
        
        ${getButton('View Profile', `${process.env.FRONTEND_URL}/friends/${data.friendId}`, '#4CAF50')}
    `;

    return getBaseTemplate(content);
};

export const friendRequestRejectedTemplate = (data) => {
    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Friend Request Update</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            ${data.rejectedBy} declined your friend request.
        </p>
        
        <div style="background-color: #fafafa; padding: 20px; border-radius: 6px; margin: 25px 0; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 15px;">
                Don't worry, you can always send another request later!
            </p>
        </div>
        
        ${getButton('Find More Friends', `${process.env.FRONTEND_URL}/friends/search`, '#667eea')}
    `;

    return getBaseTemplate(content);
};

// GROUP TEMPLATES

export const groupInviteTemplate = (data) => {
    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Group Invitation</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            <strong>${data.invitedBy}</strong> invited you to join <strong>${data.groupName}</strong>
        </p>
        
        ${getInfoBox([
        { label: 'Group Name', value: data.groupName },
        { label: 'Members', value: `${data.memberCount} members` },
        { label: 'Invited By', value: data.invitedBy }
    ], '#9C27B0')}
        
        ${data.groupDescription ? `
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>About this group:</strong></p>
                <p style="margin: 10px 0 0 0; color: #333; font-size: 15px;">${data.groupDescription}</p>
            </div>
        ` : ''}
        
        ${getButton('Join Group', `${process.env.FRONTEND_URL}/groups/join/${data.groupId}`, '#9C27B0')}
    `;

    return getBaseTemplate(content);
};

// REMINDER TEMPLATES

export const paymentReminderTemplate = (data) => {
    const contextInfo = data.contextType === 'group'
        ? `in the group <strong>${data.groupName}</strong>`
        : `with your friend <strong>${data.friendName || data.creditorName}</strong>`;

    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Payment Reminder</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            This is a friendly reminder about your outstanding balance ${contextInfo}.
        </p>
        
        <div style="background-color: #fff3e0; padding: 25px; border-radius: 8px; border-left: 4px solid #FF9800; margin: 25px 0;">
            <div style="text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px;">You owe</p>
                <p style="margin: 10px 0; color: #f44336; font-size: 36px; font-weight: bold;">Rs${data.amount}</p>
                <p style="margin: 0; color: #666; font-size: 15px;">to <strong>${data.creditorName}</strong></p>
            </div>
        </div>
        
        ${data.daysOverdue ? `
            <div style="background-color: #ffebee; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #d32f2f; font-size: 15px;">
                    This balance has been pending for <strong>${data.daysOverdue} days</strong>
                </p>
            </div>
        ` : ''}
        
        <p style="color: #666; font-size: 15px; line-height: 1.6;">
            Settling up helps keep your finances organized and maintains trust with your ${data.contextType === 'group' ? 'group members' : 'friends'}. 
        </p>
        
        <p style="color: #666; font-size: 15px; line-height: 1.6;">
            You can settle this balance using any of the available payment methods in the app.
        </p>
        
        ${getButton('Settle Now', `${process.env.FRONTEND_URL}/balances/${data.balanceId}`, '#FF9800')}
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin-top: 25px;">
            <p style="margin: 0; color: #666; font-size: 13px; text-align: center;">
                <strong>Tip:</strong> Regular settlements help keep your expenses organized and your friendships strong!
            </p>
        </div>
    `;

    return getBaseTemplate(content);
};

// WELCOME TEMPLATE

export const welcomeTemplate = (data) => {
    const userName = data.userName || data.name || 'there';

    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Welcome to Splitwise!</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thanks for joining Splitwise! We're excited to help you split expenses and keep track of who owes what.
        </p>
        
        <div style="background-color: #f5f5f5; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Quick Start Guide:</h3>
            <ul style="color: #666; line-height: 2; padding-left: 20px;">
                <li>Add friends to start splitting expenses</li>
                <li>Create groups for recurring expenses</li>
                <li>Track who owes what in real-time</li>
                <li>Settle up with multiple payment methods</li>
            </ul>
        </div>
        
        ${getButton('Get Started', `${process.env.FRONTEND_URL}/dashboard`, '#667eea')}
    `;

    return getBaseTemplate(content);
};

// RESET PASSWORD TEMPLATE

export const resetPasswordTemplate = (data) => {
    const content = `
        <h2 style="color: #333; margin-top: 0; font-size: 24px;">Reset Your Password</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi <strong>${data.userName}</strong>,</p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            You've requested to reset your password. Use the OTP code below to complete the process:
        </p>
        
        <div style="background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">Your One-Time Password</p>
            <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 10px 0;">${data.otp}</h1>
            <p style="color: #dc3545; font-weight: bold; margin-top: 15px;">This OTP will expire in 5 minutes</p>
        </div>
        
        <p style="color: #dc3545; font-size: 12px; margin-top: 30px;">This is an automated email. Please do not reply.</p>
    `;

    return getBaseTemplate(content);
};

// Export all templates
export default {
    expenseAddedTemplate,
    expenseEditedTemplate,
    expenseDeletedTemplate,
    settlementReceivedTemplate,
    settlementCompletedTemplate,
    friendRequestSentTemplate,
    friendRequestAcceptedTemplate,
    friendRequestRejectedTemplate,
    groupInviteTemplate,
    paymentReminderTemplate,
    welcomeTemplate,
    resetPasswordTemplate
};
