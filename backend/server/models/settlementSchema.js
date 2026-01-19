import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema({
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
        required: false
    },
    friend_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friend",
        required: false
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'upi', 'card', 'bank_transfer', 'other'],
        default: 'cash'
    },
    paymentSource: {
        type: String,
        enum: ['manual', 'gateway'],
        default: 'manual'
    },
    paymentDetails: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed'
    },
    settledAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

export default mongoose.model("Settlement", settlementSchema);
