import User from "../models/userSchema.js";
import { getPagination, hasPagination } from "../helpers/paginationHelper.js";
import { buildTextSearchFilter, buildSortObject, applyFilters } from "../helpers/filterHelper.js";

//all user
export const getAllUsers = async (req, res) => {
    try {
        const { search, role, status, sortBy, sortOrder } = req.query;
        const { page, skip, limit } = getPagination(req);


        // base query
        let query = {};


        // Apply text search filter (search by name or email)
        if (search) {
            const searchFilter = buildTextSearchFilter(search, ['name', 'email']);
            if (searchFilter) {
                query = { ...query, ...searchFilter };
            }
        }


        // Apply filters using filterHelper
        const filters = {
            statusField: 'status',
            status: status
        };


        query = applyFilters(query, filters);


        // Filter by role (manual since filterHelper doesn't have role-specific function)
        if (role && ['user', 'admin'].includes(role)) {
            query.role = role;
        }


        // Build sort object
        const sort = buildSortObject(sortBy || 'createdAt', sortOrder || 'desc');


        // Fetch users with filters, pagination, and sorting
        const users = await User.find(query)
            .select('-password -confirmPassword -resetPasswordOtp -resetPasswordOtpExpiry')
            .sort(sort)
            .skip(skip)
            .limit(limit);


        // Get total count for pagination
        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);
        const { hasNextPage, hasPrevPage } = hasPagination(page, limit, totalUsers);


        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: {
                users: users.map(user => ({
                    name: user.name,
                    email: user.email,
                    status: user.status
                })),
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    limit,
                    hasNextPage,
                    hasPrevPage
                }
            }
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
}

//single user
export const getSingleUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        // validate userId
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // find userid
        const user = await User.findById(user_id)
            .select('-password -confirmPassword -resetPasswordOtp -resetPasswordOtpExpiry');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phoneno: user.phoneno,
                    profilePicture: user.profilePicture,
                    role: user.role,
                    status: user.status,
                    fcmToken: user.fcmToken,
                    notificationSettings: user.notificationSettings,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message
        });
    }
}

//update user status 
export const userStatus = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { status } = req.body;

        // validate user_id
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // validate status
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        if (!['active', 'suspended'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'active' or 'suspended'"
            });
        }

        // find user
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // not change own status
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own account status"
            });
        }

        // not change same status
        if (user.status === status) {
            return res.status(400).json({
                success: false,
                message: `User is already ${status}`
            });
        }

        // update user status
        user.status = status;
        await user.save();

        const message = status === 'suspended'
            ? "User account suspended successfully"
            : "User account activated successfully";

        return res.status(200).json({
            success: true,
            message: message,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    status: user.status
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update user status",
            error: error.message
        });
    }
}
