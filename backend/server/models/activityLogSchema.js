import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({

    actor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    action: {
        type: String,
        required: true,
        enum: [
            "FRIEND_REQUEST_SENT",
            "FRIEND_REQUEST_ACCEPTED",
            "FRIEND_REMOVED",
            "GROUP_CREATED",
            "GROUP_UPDATED",
            "MEMBER_ADDED",
            "MEMBER_REMOVED",
            "MEMBER_LEFT",
            "EXPENSE_ADDED",
            "EXPENSE_UPDATED",
            "EXPENSE_DELETED",
            "SETTLEMENT_RECORDED"
        ],
    },

    entity_type: {
        type: String,
        required: true,
        enum: ["friend", "group", "expense", "settlement", "user"],

    },

    entity_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    context: {
        group_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            default: null,
        },
        target_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, {
    timestamps: true
});

export default mongoose.model("ActivityLog", activityLogSchema);
