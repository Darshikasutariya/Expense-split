import ActivityLog from "../models/activityLogSchema.js";

export const logActivity = async ({
    actor_id,
    action,
    entity_type,
    entity_id,
    group_id = null,
    target_user_id = null,
    metadata = {}
}) => {
    try {
        if (!actor_id || !action || !entity_type || !entity_id) {
            console.error("Activity log failed: missing required fields");
            return;
        }

        await ActivityLog.create({
            actor_id,
            action,
            entity_type,
            entity_id,
            context: {
                group_id,
                target_user_id
            },
            metadata
        });
    } catch (error) {
        console.error("Activity log failed:", error.message);
    }
};
