import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    toUser_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
    friend_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friend"
    },
    settlement_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Settlement"
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    currency: {
        type: String,
        default: 'INR',
        uppercase: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'netbanking'],
        default: 'card'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'],
        default: 'pending',
        index: true
    },

    stripePaymentIntentId: {
        type: String,
        unique: true,
        sparse: true
    },
    stripePaymentMethodId: {
        type: String
    },
    stripeCustomerId: {
        type: String
    },

    paymentDetails: {
        brand: String,        // visa, mastercard, etc.
        last4: String,        // last 4 digits
        country: String,
        funding: String       // credit, debit
    },

    receiptUrl: {
        type: String
    },
    failureReason: {
        type: String
    },

    refunded: {
        type: Boolean,
        default: false
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: {
        type: String
    }
}, {
    timestamps: true
});


export default mongoose.model("Payment", paymentSchema);
