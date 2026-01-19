import Group from "../models/groupSchema.js";
import User from "../models/userSchema.js";
import GroupMember from "../models/groupmemberSchema.js"
import Expense from "../models/expenseSchema.js";
import Expense_Split from "../models/expense_splitSchema.js";
import { notifyGroupMemberAdded } from "../helpers/notificationHelpers.js";
import { deleteCache, cacheKeys } from '../utils/cache.js';
import { logActivity } from '../services/activityLogService.js';


// Create group 
export const createGroup = async (req, res) => {
    try {
        const { groupName, groupDescription, groupPicture, groupType } = req.body;
        const creatorId = req.user._id;
        if (!groupName) {
            return res.status(400).json({
                message: "Group name is required"
            })
        }

        // find the user
        const user = await User.findById(creatorId)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        //not create same name group 
        const existingGroup = await Group.findOne({ groupName })
        if (existingGroup) {
            return res.status(400).json({
                message: "Group name already exists"
            })
        }

        // Create group
        const newGroup = await Group.create({
            groupName,
            groupDescription,
            groupPicture,
            groupType,
            createdBy: creatorId,
            groupMembers: [],
            stats: {
                expense: 0,
                amount: 0,
                memberCount: 1
            }
        })

        // Create GroupMember entry for the creator
        const groupMember = await GroupMember.create({
            group_id: newGroup._id,
            user_id: creatorId,
            role: "admin",
            invitiedBy: creatorId
        })

        if (!groupMember) {
            return res.status(400).json({
                message: "Failed to create group member"
            })
        }

        // Push GroupMember ID (not user ID)
        await Group.findByIdAndUpdate(newGroup._id, {
            $push: { groupMembers: groupMember._id }
        })
        // Log activity
        await logActivity({
            actor_id: req.user._id,
            action: "GROUP_CREATED",
            entity_type: "group",
            entity_id: newGroup._id,
            group_id: newGroup._id,
            metadata: {
                groupName: newGroup.groupName,
                memberCount: 1
            }
        });


        return res.status(201).json({
            message: "Group created successfully",
            data: {
                group: newGroup
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to Create group",
            error: error.message
        })
    }
}

// Edit group
export const editGroup = async (req, res) => {
    try {
        const { group_id } = req.params;
        const { groupName, groupDescription, groupPicture, groupType, splitType } = req.body;

        if (!group_id) {
            return res.status(400).json({
                message: "Group ID is required"
            })
        }

        const existingGroup = await Group.findById(group_id);
        if (!existingGroup) {
            return res.status(404).json({
                message: "Group not found"
            })
        }


        // Authorization check - only admin can edit
        const member = await GroupMember.findOne({
            group_id,
            user_id: req.user._id,
            leftGroup: false
        });

        if (!member || member.role !== 'admin') {
            return res.status(403).json({
                message: "Only admin can edit group"
            })
        }

        // Check if new group name already exists 
        if (groupName && groupName !== existingGroup.groupName) {
            const duplicateGroup = await Group.findOne({
                groupName
            });
            if (duplicateGroup) {
                return res.status(400).json({
                    message: "Group name already exists"
                })
            }
        }

        // Update group 
        const updateGroup = await Group.findByIdAndUpdate(group_id, {
            groupName,
            groupDescription,
            groupPicture,
            groupType,
            'settings.splitType': splitType
        }, { new: true })

        //cache delete
        await deleteCache(cacheKeys.groupSummary(group_id));
        await deleteCache(cacheKeys.groupMembers(group_id));

        // Log activity
        await logActivity({
            actor_id: req.user._id,
            action: "GROUP_UPDATED",
            entity_type: "group",
            entity_id: group_id,
            group_id: group_id,
            metadata: {
                groupName: updateGroup.groupName
            }
        });

        return res.status(200).json({
            message: "Group updated successfully",
            data: updateGroup
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to edit group",
            error: error.message
        })
    }
}


// Delete group
export const deleteGroup = async (req, res) => {
    try {
        const { group_id } = req.params;

        const group = await Group.findById(group_id);
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            })
        }

        // Authorization check - only creator can delete
        if (group.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only group creator can delete group"
            })
        }

        const members = await GroupMember.find({ group_id });

        // Get all expenses for this group
        const expenses = await Expense.find({ group_id });
        const expenseIds = expenses.map(e => e._id);

        // Delete all expense splits
        if (expenseIds.length > 0) {
            await Expense_Split.deleteMany({ expence_id: { $in: expenseIds } });
        }

        await Expense.deleteMany({ group_id });

        await GroupMember.deleteMany({ group_id });

        const deleteGroup = await Group.findByIdAndDelete(group_id);

        //cache delete
        await deleteCache(cacheKeys.groupSummary(group_id));
        await deleteCache(cacheKeys.groupMembers(group_id));

        return res.status(200).json({
            message: "Group deleted successfully",
            data: deleteGroup
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete group",
            error: error.message
        })
    }
}


// Add member
export const addMember = async (req, res) => {
    try {
        const { group_id } = req.params;
        let { user_id, user_ids } = req.body;
        const invitiedBy = req.user._id;

        if (!group_id) {
            return res.status(400).json({
                message: "group_id is required"
            })
        }

        if (user_id && !user_ids) {
            user_ids = [user_id];
        }

        // user_ids array
        if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
            return res.status(400).json({
                message: "user_id or user_ids array is required"
            })
        }

        // Check group exists
        const group = await Group.findById(group_id);
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            })
        }

        // Authorization check - only admin can add members
        const inviter = await GroupMember.findOne({
            group_id,
            user_id: invitiedBy,
            leftGroup: false
        });

        if (!inviter || inviter.role !== 'admin') {
            return res.status(403).json({
                message: "Only admin can add members"
            })
        }

        //inviter user
        const inviterUser = await User.findById(invitiedBy);

        const addedMembers = [];
        const skippedUsers = [];
        let newMemberCount = 0;
        const addedUsers = [];

        // each user
        for (const userId of user_ids) {
            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                skippedUsers.push({ user_id: userId, reason: "User not found" });
                continue;
            }

            // Check if user previously was in group
            const existingMember = await GroupMember.findOne({
                group_id,
                user_id: userId
            })

            let newMember;

            if (existingMember) {
                if (!existingMember.leftGroup) {
                    skippedUsers.push({ user_id: userId, reason: "Already in group" });
                    continue;
                }

                //rejoin update existing record
                newMember = await GroupMember.findByIdAndUpdate(existingMember._id, {
                    leftGroup: false,
                    leftAt: null,
                    removedBy: null,
                    removedAt: null,
                    joinedAt: Date.now(),
                    invitiedBy
                }, { new: true });


            } else {
                //new member
                newMember = await GroupMember.create({
                    group_id,
                    user_id: userId,
                    role: "member",
                    invitiedBy
                })
            }


            // Push GroupMember ID 
            await Group.findByIdAndUpdate(group_id, {
                $push: { groupMembers: newMember._id }
            })


            addedMembers.push(newMember);
            addedUsers.push(user);
            newMemberCount++;


            // Log activity
            await logActivity({
                actor_id: req.user._id,
                action: "MEMBER_ADDED",
                entity_type: "group",
                entity_id: group_id,
                group_id: group_id,
                target_user_id: userId,
                metadata: {
                    groupName: group.groupName,
                    addedUserName: user.name
                }
            });
        }


        // Update member count once
        if (newMemberCount > 0) {
            await Group.findByIdAndUpdate(group_id, {
                $inc: { 'stats.memberCount': newMemberCount }
            })
        }


        //send notification
        if (addedUsers.length > 0 && inviterUser) {
            notifyGroupMemberAdded(group, addedUsers, inviterUser).catch(err =>
                console.error('Group member notification failed:', err)
            );
        }


        await deleteCache(cacheKeys.groupSummary(group_id));
        await deleteCache(cacheKeys.groupMembers(group_id));


        // Invalidate user caches for all added members
        for (const userId of user_ids) {
            await deleteCache(cacheKeys.userGroups(userId));
        }


        return res.status(200).json({
            message: `${addedMembers.length} member(s) added successfully`,
            data: {
                added: addedMembers,
                skipped: skippedUsers
            }
        })


    } catch (error) {
        return res.status(500).json({
            message: "Failed to add member",
            error: error.message
        })
    }
}


// Remove member 
export const removeMember = async (req, res) => {
    try {
        const { group_id } = req.params;
        let { user_id, user_ids } = req.body;
        const removedBy = req.user._id;

        if (!group_id) {
            return res.status(400).json({
                message: "group_id is required"
            })
        }

        if (user_id && !user_ids) {
            user_ids = [user_id];
        }


        if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
            return res.status(400).json({
                message: "user_id or user_ids array is required"
            })
        }


        const group = await Group.findById(group_id);
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            })
        }


        // Authorization check 
        const remover = await GroupMember.findOne({
            group_id,
            user_id: removedBy,
            leftGroup: false
        });


        if (!remover || remover.role !== 'admin') {
            return res.status(403).json({
                message: "Only admin can remove members"
            })
        }


        const removedMembers = [];
        const skippedUsers = [];
        let removedMemberCount = 0;


        // Loop through each user
        for (const userId of user_ids) {
            // Find the member
            const existingMember = await GroupMember.findOne({
                group_id,
                user_id: userId,
                leftGroup: false
            })


            if (!existingMember) {
                skippedUsers.push({ user_id: userId, reason: "User not found in group" });
                continue;
            }


            const user = await User.findById(userId);

            // remove member
            const updatedMember = await GroupMember.findByIdAndUpdate(existingMember._id, {
                leftGroup: true,
                leftAt: Date.now(),
                removedBy,
                removedAt: Date.now()
            }, { new: true })


            // Remove GroupMember ID 
            await Group.findByIdAndUpdate(group_id, {
                $pull: { groupMembers: existingMember._id }
            })


            removedMembers.push(updatedMember);
            removedMemberCount++;


            // Log activity
            await logActivity({
                actor_id: req.user._id,
                action: "MEMBER_REMOVED",
                entity_type: "group",
                entity_id: group_id,
                group_id: group_id,
                target_user_id: userId,
                metadata: {
                    groupName: group.groupName,
                    removedUserName: user ? user.name : 'Unknown'
                }
            });
        }


        // Update member count once
        if (removedMemberCount > 0) {
            await Group.findByIdAndUpdate(group_id, {
                $inc: { 'stats.memberCount': -removedMemberCount }
            })
        }


        // Delete cache
        await deleteCache(cacheKeys.groupSummary(group_id));
        await deleteCache(cacheKeys.groupMembers(group_id));
        for (const userId of user_ids) {
            await deleteCache(cacheKeys.userGroups(userId));
        }

        return res.status(200).json({
            message: `${removedMembers.length} member(s) removed successfully`,
            data: {
                removed: removedMembers,
                skipped: skippedUsers
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

//get group list
export const getGroupList = async (req, res) => {
    try {
        const user_id = req.user._id;

        // Find all group memberships for this user
        const memberships = await GroupMember.find({
            user_id: user_id,
            leftGroup: false
        }).select('group_id');

        const groupIds = memberships.map(m => m.group_id);

        // Fetch groups with populated member info
        const groups = await Group.find({
            _id: { $in: groupIds }
        }).populate({
            path: 'groupMembers',
            populate: {
                path: 'user_id',
                select: 'name email profilePicture'
            }
        });

        // Transform to include member details
        const groupsWithMembers = groups.map(group => ({
            ...group.toObject(),
            members: group.groupMembers
                .filter(m => !m.leftGroup)
                .map(m => ({
                    _id: m.user_id?._id,
                    name: m.user_id?.name,
                    email: m.user_id?.email,
                    profilePicture: m.user_id?.profilePicture,
                    role: m.role
                }))
        }));

        return res.status(200).json({
            message: "Group list fetched successfully",
            data: groupsWithMembers
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}