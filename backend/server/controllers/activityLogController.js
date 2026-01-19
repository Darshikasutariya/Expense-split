import ActivityLog from "../models/activityLogSchema.js";
import { getPagination, hasPagination } from "../helpers/paginationHelper.js";
import { buildDateFilter, buildSortObject } from "../helpers/filterHelper.js";


export const getAllActivityLogs = async (req, res) => {
    try {
        const { action, entity_type, actor_id, group_id, start_date, end_date, sort_by, sort_order } = req.query;
        const filter = {};

        if (action) {
            filter.action = action;
        }
        if (entity_type) {
            filter.entity_type = entity_type;
        }
        if (actor_id) {
            filter.actor_id = actor_id;
        }
        if (group_id) {
            filter['context.group_id'] = group_id;
        }

        //date filter
        const dateFilter = buildDateFilter(start_date, end_date);
        if (dateFilter) {
            filter.createdAt = dateFilter;
        }
        const { page, skip, limit } = getPagination(req);

        const sortObj = buildSortObject(sort_by, sort_order);

        //activity logs
        const activityLogs = await ActivityLog.find(filter)
            .populate('actor_id', 'name email')
            .populate('context.group_id', 'name')
            .populate('context.target_user_id', 'name email')
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .lean();


        const totalCount = await ActivityLog.countDocuments(filter);
        const { hasNextPage, hasPrevPage } = hasPagination(page, limit, totalCount);

        return res.status(200).json({
            message: 'Activity logs fetched successfully',
            success: true,
            data: activityLogs,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(totalCount / limit),
                total_count: totalCount,
                limit: limit,
                has_next: hasNextPage,
                has_prev: hasPrevPage
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch activity logs',
            success: false,
            error: error.message
        });
    }
};

// single activity log
export const getActivityLogById = async (req, res) => {
    try {
        const { user_id } = req.params;

        const activityLog = await ActivityLog.findById(user_id)
            .populate('actor_id', 'name email')
            .populate('context.group_id', 'name')
            .populate('context.target_user_id', 'name email')
            .lean();


        if (!activityLog) {
            return res.status(404).json({
                message: 'Activity log not found',
                success: false,
                error: 'Activity log not found'
            });
        }


        return res.status(200).json({
            message: 'Activity log fetched successfully',
            success: true,
            data: activityLog
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch activity log',
            success: false,
            error: error.message
        });
    }
};

// user activity logs   
export const getUserActivityLogs = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { action, entity_type, start_date, end_date } = req.query;

        const filter = {
            $or: [
                { actor_id: user_id },
                { 'context.target_user_id': user_id }
            ]
        };

        if (action) {
            filter.action = action;
        }
        if (entity_type) {
            filter.entity_type = entity_type;
        }

        const dateFilter = buildDateFilter(start_date, end_date);
        if (dateFilter) {
            filter.createdAt = dateFilter;
        }

        const { page, skip, limit } = getPagination(req);

        const activityLogs = await ActivityLog.find(filter)
            .populate('actor_id', 'name email')
            .populate('context.group_id', 'name')
            .populate('context.target_user_id', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();


        const totalCount = await ActivityLog.countDocuments(filter);
        const { hasNextPage, hasPrevPage } = hasPagination(page, limit, totalCount);

        return res.status(200).json({
            message: 'User activity logs fetched successfully',
            success: true,
            data: activityLogs,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(totalCount / limit),
                total_count: totalCount,
                limit: limit,
                has_next: hasNextPage,
                has_prev: hasPrevPage
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch user activity logs',
            success: false,
            error: error.message
        });
    }
};
