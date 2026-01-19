import Notification from '../models/notificationSchema.js';
import User from '../models/userSchema.js';
import { getPagination } from '../helpers/paginationHelper.js';
import { applyFilters, buildSortObject } from '../helpers/filterHelper.js';


// Get User Notifications
export const getUserNotifications = async (req, res) => {
    try {
        const { unreadOnly, type,
            startDate,
            endDate,
            sortBy,
            sortOrder } = req.query;
        const { page, skip, limit } = getPagination(req);
        const user_id = req.user._id;


        // Build query
        let query = { user_id };


        //has filter
        const hasFilters = unreadOnly || type || startDate || endDate;

        if (unreadOnly) {
            query.read = false;
        }

        if (type) {
            query.type = type;
        }

        query = applyFilters(query, {
            dateField: 'createdAt',
            startDate,
            endDate
        });
        const sort = buildSortObject(sortBy, sortOrder);
        const totalCount = await Notification.countDocuments(query);

        if (totalCount === 0) {
            if (hasFilters) {
                return res.status(200).json({
                    success: true,
                    message: "No notifications match the applied filters",
                });
            }
            return res.status(200).json({
                success: true,
                message: "No notifications found",
            });
        }

        const notifications = await Notification.find(query)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .populate('relatedTo.expense_id', 'title amount')
            .populate('relatedTo.group_id', 'groupName')
            .populate('relatedTo.settlement_id', 'amount paymentMethod');

        if (notifications.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No notifications found on this page",
            });
        }

        const unreadCount = await Notification.countDocuments({ user_id, read: false });

        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: notifications,
            filters: {
                unreadOnly,
                type,
                startDate,
                endDate,
                sortBy,
                sortOrder,
                unreadCount,
                totalCount
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
};


// Delete Notification
export const deleteNotification = async (req, res) => {
    try {
        const { notification_id } = req.params;
        const user_id = req.user._id;


        const notification = await Notification.findOneAndDelete({
            _id: notification_id,
            user_id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
            data: notification
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete notification",
            error: error.message
        });
    }
};
