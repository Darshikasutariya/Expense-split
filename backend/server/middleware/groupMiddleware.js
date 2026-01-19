import GroupMember from "../models/groupmemberSchema.js";

const checkUserAdminOrMember = async (req, res, next) => {
    try {
        const groupMember = await GroupMember.findOne({
            group_id: req.params.group_id,
            user_id: req.user._id
        });

        if (!groupMember) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - User not A Member"
            })
        }

        if (groupMember.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: "Admin Action Required"
            })
        }

        req.groupMember = groupMember;
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Failed to check user admin or member",
            error: error.message
        })
    }
}

export default checkUserAdminOrMember;

