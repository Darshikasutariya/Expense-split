import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import { storeTokenInCookie, storeLoginTokenInCookie, generateToken, generateLoginToken } from "../utils/generateToken.js"
import { sendResetPasswordOtp } from "../services/emailService.js";
import { notifyUserRegistered } from "../helpers/notificationHelpers.js";

//register user
export const userRegister = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phoneno, adminSecretKey } = req.body;


        let role = 'user';


        if (adminSecretKey) {
            if (adminSecretKey === process.env.ADMIN_SECRET_KEY) {
                role = 'admin';
            } else {
                return res.status(403).json({
                    success: false,
                    message: "Invalid admin secret key"
                });
            }
        }

        //validation
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //check for existing user
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }


        //compare passwords
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            })
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);

        // Create user 
        let createUser = await User.create({
            name,
            email,
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
            phoneno,
            role: role
        })

        console.log("Inside Register....");
        //store token in cookie
        storeTokenInCookie(res, generateToken(createUser));

        console.log(`New ${role} user created:`, createUser);

        //send notification
        notifyUserRegistered(createUser).catch(err =>
            console.error('Welcome notification failed:', err)
        );

        return res.status(201).json({
            success: true,
            message: `${role === 'admin' ? 'Admin' : 'User'} registered successfully`,
            user: {
                id: createUser._id,
                name: createUser.name,
                email: createUser.email,
                role: createUser.role
            }
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

//Log in User
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validation
        if (!email || !password) {
            return res.status(400).json({
                message: "All filed are Required",
            })
        }

        //check existing user
        let userExits = await User.findOne({ email });
        if (!userExits) {
            return res.status(400).json({
                message: "User not found!",
            })
        }

        //compare password
        const passwordMatch = await bcrypt.compare(password, userExits.password);
        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid Password!",
            })
        }

        // Check if user account is suspended
        if (userExits.status === 'suspended') {
            return res.status(403).json({
                success: false,
                message: "Access denied - Your account has been suspended. Please contact support."
            })
        }

        //store token in cookie
        storeLoginTokenInCookie(res, generateLoginToken(userExits));
        console.log("user logged in successfully", userExits);

        return res.status(200).json({
            message: "User logged in successfully",
            user: userExits
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

//logout user
export const userLogout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        return res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

//forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        //validation
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            })
        }
        let userExits = await User.findOne({ email });
        if (!userExits) {
            return res.status(400).json({
                message: "User not found!",
            })
        }


        //Generate Reset Password OTP 
        const resetPasswordOtp = Math.floor(100000 + Math.random() * 900000);
        const resetPasswordOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

        //reset password OTP
        const passwordReset = await User.updateOne(
            { email },
            {
                resetPasswordOtp,
                resetPasswordOtpExpiry
            }
        );

        if (!passwordReset) {
            return res.status(400).json({
                message: "Failed to generate OTP. Please try again!"
            })
        }
        //send email OTP
        const emailResult = await sendResetPasswordOtp(userExits, resetPasswordOtp);

        if (!emailResult) {
            return res.status(500).json({
                message: "Failed to send OTP email. Please try again!",
                error: emailResult.message
            })
        }

        return res.status(200).json({
            message: "Password reset OTP sent to your email successfully!",
            email: email
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

//verify OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        //validation
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
            })
        }
        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found!",
            })
        }

        //check if OTP exists
        if (!user.resetPasswordOtp) {
            return res.status(400).json({
                message: "No OTP request found. Please request a new OTP!",
            })
        }

        //check if OTP is expired
        if (Date.now() > user.resetPasswordOtpExpiry) {
            return res.status(400).json({
                message: "OTP has expired! Please request a new OTP.",
            })
        }

        //verify OTP
        if (user.resetPasswordOtp !== parseInt(otp)) {
            return res.status(400).json({
                message: "Invalid OTP! Please try again.",
            })
        }

        return res.status(200).json({
            message: "OTP verified successfully! You can now reset your password.",
            email: email
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

//reset password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        //validation
        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        // passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match!",
            })
        }

        //user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found!",
            })
        }

        // OTP exists
        if (!user.resetPasswordOtp) {
            return res.status(400).json({
                message: "No OTP request found. Please request a new OTP!",
            })
        }

        // OTP is expired
        if (Date.now() > user.resetPasswordOtpExpiry) {
            return res.status(400).json({
                message: "OTP has expired! Please request a new OTP.",
            })
        }

        // verify OTP
        if (user.resetPasswordOtp !== parseInt(otp)) {
            return res.status(400).json({
                message: "Invalid OTP! Please try again.",
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);


        //update password and clear OTP fields
        const updateResult = await User.updateOne(
            { email },
            {
                password: hashedPassword,
                confirmPassword: hashedConfirmPassword,
                resetPasswordOtp: null,
                resetPasswordOtpExpiry: null
            }
        );


        if (!updateResult.modifiedCount) {
            return res.status(400).json({
                message: "Failed to reset password. Please try again!",
            })
        }


        return res.status(200).json({
            message: "Password reset successfully! You can now login with your new password.",
        })


    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}
