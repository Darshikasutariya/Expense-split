import mongoose from "mongoose"

const friendSchema = new mongoose.Schema({
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "removed"],
        default: "pending"
    },
    expiredAt: {
        type: Date,
        // default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    acceptedAt: {
        type: Date
    },
    rejectedAt: {
        type: Date
    },
    removedAt: {
        type: Date
    },
    removedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

export default mongoose.model("Friend", friendSchema);
