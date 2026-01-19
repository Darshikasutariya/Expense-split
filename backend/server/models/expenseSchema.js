import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    expense_type: {
        type: String,
        enum: ['group', 'friend'],
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
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['food', 'travel', 'entertainment', 'utilities', 'shopping', 'health', 'other'],
        default: 'other'
    },
    paid_by: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true, min: 0 }

    }],
    split_all: {
        type: Boolean,
        default: true
    },
    split_among: [{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, default: 0 },
        percentage: { type: Number },
        shares: { type: Number }
    }],
    split_type: {
        type: String,
        enum: ['equal', 'exact', 'percentage', 'shares'],
        default: "equal",
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    }
}, {
    timestamps: true,
})

export default mongoose.model("Expense", expenseSchema);
