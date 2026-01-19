import User from "../models/userSchema.js";
import { getCache, setCache, deleteCache, cacheKeys } from '../utils/cache.js';


//Show user profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const cacheKey = cacheKeys.userProfile(userId);


        // Check cache first
        const cachedData = await getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        // Cache miss - fetch from database
        const user = await User.findById(userId).select({ password: 0, confirmPassword: 0 });
        if (!user) {
            return res.status(400).json({
                message: "User not found!",
            })
        }

        const responseData = {
            message: "User profile fetched successfully",
            user: user
        };


        // Store in cache (5 minutes TTL)
        await setCache(cacheKey, responseData, 300);


        return res.status(200).json(responseData);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


//search user
export const searchUser = async (req, res) => {
    try {
        const searchQuery = req.query.query || '';

        if (!searchQuery || searchQuery.trim() === '') {
            console.log("Search query is missing");
            return res.status(400).json({
                message: "Search query is required"
            })
        }

        const query = searchQuery.trim();

        const users = await User.find({
            name: { $regex: query, $options: "i" }
        })

        return res.status(200).json({
            message: "User fetched successfully",
            data: users
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}


//update profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phoneno, profilePicture } = req.body;

        if (phoneno && phoneno.trim() !== '') {
            const existingUser = await User.findOne({
                phoneno,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Phone no already exists"
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            name,
            phoneno,
            profilePicture
        }, { new: true })

        //delete cache
        await deleteCache(cacheKeys.userProfile(userId));
        await deleteCache(cacheKeys.userDashboard(userId));


        return res.status(200).json({
            message: "User profile updated successfully",
            data: updatedUser
        })


    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}


//delete user      
export const userDelete = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndDelete(userId);

        //delete cache
        await deleteCache(cacheKeys.userProfile(userId));
        await deleteCache(cacheKeys.userDashboard(userId));
        await deleteCache(cacheKeys.userBalance(userId));


        return res.status(200).json({
            message: "User deleted successfully!",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

//notification
export const getNotification = async (req, res) => {
    try {
        const user_id = req.user._id;
        const user = await User.findById(user_id).select('notificationSettings');

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Notification fetched successfully",
            data: user.notificationSettings
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

//update notification
export const updateNotification = async (req, res) => {
    try {
        const user_id = req.user._id;
        const { push, email, inApp } = req.body;
        const user = await User.findByIdAndUpdate(
            user_id,
            {
                'notificationSettings.push': push,
                'notificationSettings.email': email,
                'notificationSettings.inApp': inApp
            },
            { new: true }
        ).select('notificationSettings');
        return res.status(200).json({
            message: "Notification updated successfully",
            data: user.notificationSettings
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}