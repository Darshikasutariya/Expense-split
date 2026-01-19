import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: [
            'expense_added',
            'expense_edited',
            'expense_deleted',
            'settlement_received',
            'settlement_completed',
            'friend_request_sent',
            'friend_request_accepted',
            'friend_request_rejected',
            'group_invite',
            'group_joined',
            'group_removed',
            'payment_reminder',
            'welcome',
            'reset_password'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        default: {}
    },
    read: {
        type: Boolean,
        default: false
    },
    sent_via: {
        email: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true },
        push: { type: Boolean, default: false }
    },
    relatedTo: {
        expense_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expense"
        },
        settlement_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Settlement"
        },
        group_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group"
        },
        friend_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Friend"
        }
    },
    actionUrl: {
        type: String
    }
}, { timestamps: true });


export default mongoose.model("Notification", notificationSchema);
