import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
    },
    friend_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friend",
    },
    groupDescription: {
        type: String,
    },
    groupPicture: {
        type: String,
    },
    groupType: {
        type: String,
        enum: ['trip', 'home', 'couple', 'friends', 'family', 'work', 'other'],
        default: 'other'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    groupMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupMember"
        }
    ],
    settings: {
        splitType: {
            type: String,
            enum: ['equal', 'exact', 'percentage', 'shares'],
            default: 'equal'
        },
        currency: { type: String, default: 'INR' }
    },
    stats: {
        expense: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
        memberCount: { type: Number, default: 1 }
    }
}, {
    timestamps: true
})

export default mongoose.model("Group", groupSchema);

