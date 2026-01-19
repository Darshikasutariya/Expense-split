import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
    fromUser_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUser_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: null
    },
    friend_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friend",
        default: null
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        default: "debit"
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})


export default mongoose.model("Balance", balanceSchema);
