import transporter from '../config/email.js';
import emailTemplates from '../templates/emailTemplates.js';



// Send Email with Template
export const sendTemplateEmail = async (to, subject, templateName, data) => {
    try {
        if (!to) {
            console.log('No email address provided');
            return { success: false, reason: 'no_email' };
        }
        console.log('Sending email to:', to, templateName);

        let htmlContent;

        switch (templateName) {
            case 'expense_added':
                htmlContent = emailTemplates.expenseAddedTemplate(data);
                break;
            case 'expense_edited':
                htmlContent = emailTemplates.expenseEditedTemplate(data);
                break;
            case 'expense_deleted':
                htmlContent = emailTemplates.expenseDeletedTemplate(data);
                break;
            case 'settlement_received':
                htmlContent = emailTemplates.settlementReceivedTemplate(data);
                break;
            case 'settlement_completed':
                htmlContent = emailTemplates.settlementCompletedTemplate(data);
                break;
            case 'friend_request_sent':
                htmlContent = emailTemplates.friendRequestSentTemplate(data);
                break;
            case 'friend_request_accepted':
                htmlContent = emailTemplates.friendRequestAcceptedTemplate(data);
                break;
            case 'friend_request_rejected':
                htmlContent = emailTemplates.friendRequestRejectedTemplate(data);
                break;
            case 'group_invite':
                htmlContent = emailTemplates.groupInviteTemplate(data);
                break;
            case 'payment_reminder':
                htmlContent = emailTemplates.paymentReminderTemplate(data);
                break;
            case 'welcome':
                htmlContent = emailTemplates.welcomeTemplate(data);
                break;
            // case 'reset_password':
            //     htmlContent = emailTemplates.resetPasswordTemplate(data);
            //     break;
            default:
                console.error('Unknown email template:', templateName);
                return { success: false, reason: 'invalid_template' };
        }

        const mailOptions = {
            from: `"Splitwise App" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}:`, info.messageId);

        return {
            success: true,
            messageId: info.messageId,
            template: templateName
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            reason: 'send_failed',
            error: error.message
        };
    }
};

// Send Plain Text Email
export const sendPlainEmail = async (to, subject, text, html = null) => {
    try {
        if (!to) {
            console.log('No email address provided');
            return { success: false, reason: 'no_email' };
        }

        const mailOptions = {
            from: `"Splitwise App" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html || text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Plain email sent successfully to ${to}:`, info.messageId);

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Error sending plain email:', error);
        return {
            success: false,
            reason: 'send_failed',
            error: error.message
        };
    }
};

// Send Bulk Emails
export const sendBulkEmails = async (recipients) => {
    try {
        const results = await Promise.allSettled(
            recipients.map(recipient =>
                sendTemplateEmail(
                    recipient.email,
                    recipient.subject,
                    recipient.template,
                    recipient.data
                )
            )
        );

        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        const failed = results.length - successful;

        console.log(`Bulk emails: ${successful} sent, ${failed} failed`);

        return {
            success: true,
            sent: successful,
            failed: failed,
            results
        };
    } catch (error) {
        console.error('Error sending bulk emails:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Specific Email Functions

export const sendExpenseAddedEmail = async (userEmail, data) => {
    return await sendTemplateEmail(
        userEmail,
        `New Expense: ${data.title}`,
        'expense_added',
        data
    );
};
export const sendSettlementReceivedEmail = async (userEmail, data) => {
    return await sendTemplateEmail(
        userEmail,
        `Payment Received: Rs${data.amount}`,
        'settlement_received',
        data
    );
};

export const sendFriendRequestEmail = async (userEmail, data) => {
    return await sendTemplateEmail(
        userEmail,
        `${data.senderName} sent you a friend request`,
        'friend_request_sent',
        data
    );
};

export const sendGroupInviteEmail = async (userEmail, data) => {
    return await sendTemplateEmail(
        userEmail,
        `You're invited to join ${data.groupName}`,
        'group_invite',
        data
    );
};

export const sendPaymentReminderEmail = async (userEmail, data) => {
    return await sendTemplateEmail(
        userEmail,
        `Reminder: You owe Rs${data.amount}`,
        'payment_reminder',
        data
    );
};

export const sendWelcomeEmail = async (userEmail, data) => {
    return await sendTemplateEmail(
        userEmail,
        'Welcome to Splitwise!',
        'welcome',
        data
    );
};

// // Send Reset Password Email
// export const resetPasswordEmail = async (user, otp) => {
//     return await sendTemplateEmail(
//         user.email,
//         'Reset Your Password - OTP Verification',
//         'reset_password',
//         {
//             userName: user.name,
//             otp: otp
//         }
//     );
// };


export const sendResetPasswordOtp = async (user, otp) => {
    const subject = 'Your OTP for Password Reset'
    const text = `Hello ${user.name},
    Your One-Time Password (OTP) for resetting your password is: 
    OTP: ${otp}
    This OTP is valid for 5 minutes.
    Do NOT share this OTP with anyone.
    -Splitwise App
`;

    return await sendPlainEmail(
        user.email,
        subject,
        text
    )
}

export default {
    sendTemplateEmail,
    sendPlainEmail,
    sendBulkEmails,
    sendExpenseAddedEmail,
    sendSettlementReceivedEmail,
    sendFriendRequestEmail,
    sendGroupInviteEmail,
    sendPaymentReminderEmail,
    sendWelcomeEmail,
    sendResetPasswordOtp
};


