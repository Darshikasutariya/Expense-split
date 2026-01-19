import mongoose from "mongoose";

const expense_splitSchema = new mongoose.Schema({
    expense_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    friend_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friend",
    },
    split_type: {
        type: String,
        enum: ['equal', 'exact', 'percentage', 'shares'],
        default: "equal",
        required: true
    },
    split_value: {
        type: Number,
        required: true
    },

    //amount 
    owed_amount: {
        type: Number,
        required: true
    },
    paid_amount: {
        type: Number,
        required: true
    },
    balance_amount: {
        type: Number,
        required: true
    }
})

export default mongoose.model("Expense_Split", expense_splitSchema);