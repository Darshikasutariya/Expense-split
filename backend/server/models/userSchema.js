import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneno: {
        type: String,
    },
    profilePicture: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordOtp: {
        type: Number,
        required: false
    },
    resetPasswordOtpExpiry: {
        type: Date,
        required: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ["active", "suspended"],
        default: "active",
    },
    fcmToken: {
        type: String,
        default: null
    },
    notificationSettings: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true }
    }
}, {
    timestamps: true,
})

export default mongoose.model("User", userSchema);
