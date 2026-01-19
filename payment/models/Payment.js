import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUser_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        group_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            default: null,
        },
        friend_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Friend",
            default: null,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "INR",
        },
        paymentMethod: {
            type: String,
            enum: ["card", "upi", "netbanking"],
            required: true,
        },
        stripePaymentIntentId: {
            type: String,
            required: true,
        },
        stripePaymentMethodId: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "succeeded", "failed", "canceled"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
