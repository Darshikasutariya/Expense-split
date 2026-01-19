import mongoose from "mongoose";

const groupmemberSchema = new mongoose.Schema(
    {
        group_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member"
        },
        invitiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        leftGroup: {
            type: Boolean,
            default: false
        },
        leftAt: {
            type: Date,
            default: null
        },
        removedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        removedAt: {
            type: Date,
            default: null
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export default mongoose.model("GroupMember", groupmemberSchema);
