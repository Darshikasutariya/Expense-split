import Expense from "../models/expenseSchema.js";
import Group from "../models/groupSchema.js";
import GroupMember from "../models/groupmemberSchema.js";
import Friend from "../models/friendSchema.js";
import { createSplitRecords, deleteSplitRecords, calculateSplitAmounts } from "./splitController.js";
import { updateBalances, deleteBalancesForExpense } from "./balanceController.js";
import { notifyExpenseAdded, notifyExpenseEdited, notifyExpenseDeleted } from "../helpers/notificationHelpers.js";
import { deleteCache, cacheKeys } from '../utils/cache.js';
import { getPagination } from '../helpers/paginationHelper.js';
import { applyFilters, buildSortObject } from '../helpers/filterHelper.js';
import { logActivity } from '../services/activityLogService.js';

// Add expense 
export const addExpense = async (req, res) => {
    try {
        const { expense_type, title, description, amount, category, paid_by, split_among, split_type, currency } = req.body;

        const { group_id, friend_id } = req.params;

        if (!expense_type || !title || !amount || !paid_by) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            });
        }

        if (!['group', 'friend'].includes(expense_type)) {
            return res.status(400).json({
                success: false,
                message: "Expense type must be either 'group' or 'friend'"
            });
        }

        if (!Array.isArray(paid_by) || paid_by.length === 0) {
            return res.status(400).json({
                success: false,
                message: "paid_by must be a non-empty array"
            });
        }

        const totalPaidAmount = paid_by.reduce((sum, payer) => sum + parseFloat(payer.amount), 0);
        if (Math.abs(totalPaidAmount - amount) > 0.01) {
            return res.status(400).json({
                success: false,
                message: `Total paid amount (${totalPaidAmount}) must equal expense amount (${amount})`
            });
        }

        let finalSplitAmong = [];
        let split_all = true;

        //group expense
        if (expense_type === 'group') {
            if (!group_id) {
                return res.status(400).json({
                    success: false,
                    message: "Group id not found"
                });
            }

            //group exists
            const group = await Group.findById(group_id);
            if (!group) {
                return res.status(404).json({
                    success: false,
                    message: "Group not found"
                });
            }

            //group member
            const isMember = await GroupMember.findOne({
                group_id,
                user_id: req.user._id,
                leftGroup: false
            });

            if (!isMember) {
                return res.status(403).json({
                    success: false,
                    message: "You are not a member of this group"
                });
            }

            // split_among empty
            if (!split_among || split_among.length === 0) {
                split_all = true;

                const members = await GroupMember.find({
                    group_id,
                    leftGroup: false
                });
                finalSplitAmong = members.map(m => ({ user_id: m.user_id }));
            } else {
                split_all = false;
                finalSplitAmong = split_among;


                // split_among are group members
                const memberIds = await GroupMember.find({
                    group_id,
                    leftGroup: false
                }).select('user_id');

                const validMemberIds = memberIds.map(m => m.user_id.toString());

                for (const split of finalSplitAmong) {
                    if (!validMemberIds.includes(split.user_id.toString())) {
                        return res.status(400).json({
                            success: false,
                            message: "All users in split_among must be active group members"
                        });
                    }
                }
            }

            // paid_by users are group members
            const paidByUserIds = paid_by.map(p => p.user_id.toString());
            const memberIds = await GroupMember.find({
                group_id,
                leftGroup: false
            }).select('user_id');

            const validMemberIds = memberIds.map(m => m.user_id.toString());

            for (const user_id of paidByUserIds) {
                if (!validMemberIds.includes(user_id)) {
                    return res.status(400).json({
                        success: false,
                        message: "All users in paid_by must be active group members"
                    });
                }
            }

        } else if (expense_type === 'friend') {
            //friend expense
            if (!friend_id) {
                return res.status(400).json({
                    success: false,
                    message: "friend_id not found"
                });
            }

            // friend exists
            const friendship = await Friend.findById(friend_id);
            if (!friendship) {
                return res.status(404).json({
                    success: false,
                    message: "Friend not found"
                });
            }

            //  friendship is accepted
            if (friendship.status !== 'accepted') {
                return res.status(403).json({
                    success: false,
                    message: "Friend request must be accepted to add expenses"
                });
            }


            // Verify the log in user friend 
            const loggedInUserId = req.user._id.toString();
            const isRequester = friendship.requesterId.toString() === loggedInUserId;
            const isReceiver = friendship.reciverId.toString() === loggedInUserId;

            if (!isRequester && !isReceiver) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to add expenses to this friendship"
                });
            }


            // paid_by users are friends
            const paidByUserIds = paid_by.map(p => p.user_id.toString());
            const validMemberIds = [friendship.requesterId.toString(), friendship.reciverId.toString()];

            for (const user_id of paidByUserIds) {
                if (!validMemberIds.includes(user_id)) {
                    return res.status(400).json({
                        success: false,
                        message: "All users in paid_by must be friends"
                    });
                }
            }


            //  split_among
            if (!split_among || split_among.length === 0) {
                split_all = true;
                // Get both friends
                finalSplitAmong = [
                    { user_id: friendship.requesterId },
                    { user_id: friendship.reciverId }
                ];
            } else {
                split_all = false;
                finalSplitAmong = split_among;

                //only 2 people for friend expense
                if (finalSplitAmong.length > 2) {
                    return res.status(400).json({
                        success: false,
                        message: "Friend expense can only be split between 2 people"
                    });
                }

                // both users are the friends
                const friendUserIds = [friendship.requesterId.toString(), friendship.reciverId.toString()];
                for (const split of finalSplitAmong) {
                    if (!friendUserIds.includes(split.user_id.toString())) {
                        return res.status(400).json({
                            success: false,
                            message: `Split user ${split.user_id} must be a friend in this relationship (allowed: ${friendUserIds.join(', ')})`
                        });
                    }
                }
            }
        }

        // Calculate split details to save in Expense document for display
        const calculatedSplits = calculateSplitAmounts(amount, split_type || 'equal', finalSplitAmong);

        // Merge calculated amounts back into finalSplitAmong
        finalSplitAmong = finalSplitAmong.map(member => {
            const calculation = calculatedSplits.find(c => c.user_id.toString() === member.user_id.toString());
            return {
                ...member,
                amount: calculation ? calculation.owed_amount : 0,
                // Ensure percentage/shares are preserved if they exist in member or calculation
                percentage: member.percentage || (calculation ? calculation.split_value : undefined),
                shares: member.shares || (calculation ? calculation.split_value : undefined)
            };
        });

        // Create expense
        const expense = await Expense.create({ expense_type, group_id, friend_id, title, description, amount, category, paid_by, split_among: finalSplitAmong, split_all, split_type: split_type || 'equal', currency });

        // Create split records
        await createSplitRecords(expense, paid_by, split_type || 'equal', finalSplitAmong);

        // Balance update
        if (expense_type === 'group') {
            await updateBalances(expense._id, group_id);
        } else if (expense_type === 'friend') {
            await updateBalances(expense._id, null, friend_id);
        }


        // Update group stats
        if (expense_type === 'group') {
            await Group.findByIdAndUpdate(group_id, {
                $inc: {
                    'stats.expense': 1,
                    'stats.amount': amount
                }
            });
        }


        let affectedMembers = [];
        if (expense_type === 'group') {
            affectedMembers = await GroupMember.find({
                group_id,
                leftGroup: false
            });
        } else if (expense_type === 'friend') {
            const friendship = await Friend.findById(friend_id);
            if (friendship) {
                affectedMembers = [
                    { user_id: friendship.requesterId },
                    { user_id: friendship.reciverId }
                ];
            }
        }


        // Log activity
        await logActivity({
            actor_id: req.user._id,
            action: "EXPENSE_ADDED",
            entity_type: "expense",
            entity_id: expense._id,
            group_id: expense.group_id || null,
            metadata: {
                amount: expense.amount,
                currency: expense.currency,
                expense_description: expense.title
            }
        });
        //send notification
        if (affectedMembers.length > 0) {
            notifyExpenseAdded(expense, req.user, affectedMembers).catch(err =>
                console.error('Expense added notification failed:', err)
            );
        }


        if (expense_type === 'group') {
            await deleteCache(cacheKeys.groupSummary(group_id));
            await deleteCache(cacheKeys.groupExpenses(group_id));
        }
        // caches
        for (const member of finalSplitAmong) {
            await deleteCache(cacheKeys.userBalance(member.user_id));
            await deleteCache(cacheKeys.userDashboard(member.user_id));
        }


        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            data: expense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add expense",
            error: error.message
        });
    }
}

// Edit Expense
export const editExpense = async (req, res) => {
    try {
        const { expense_id } = req.params;
        const { title, description, amount, category, paid_by, split_among, split_type, currency } = req.body;

        if (!expense_id) {
            return res.status(400).json({
                success: false,
                message: "Expense ID is required"
            });
        }

        // Check expense exists
        const expense = await Expense.findById(expense_id);
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        const oldAmount = expense.amount;

        // authorization check
        if (expense.expense_type === 'group') {
            const member = await GroupMember.findOne({
                group_id: expense.group_id,
                user_id: req.user._id,
                leftGroup: false
            });

            if (!member) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to edit this expense"
                });
            }
        } else if (expense.expense_type === 'friend') {
            const friendship = await Friend.findById(expense.friend_id);

            if (!friendship) {
                return res.status(404).json({
                    success: false,
                    message: "Friendship not found"
                });
            }

            const loggedInUserId = req.user._id.toString();
            const isRequester = friendship.requesterId.toString() === loggedInUserId;
            const isReceiver = friendship.reciverId.toString() === loggedInUserId;

            if (!isRequester && !isReceiver) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to edit this expense"
                });
            }
        }

        //  paid_by if provided
        if (paid_by) {
            if (!Array.isArray(paid_by) || paid_by.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "paid_by must be a non-empty array"
                });
            }

            // total paid amount
            const newAmount = amount || expense.amount;
            const totalPaidAmount = paid_by.reduce((sum, payer) => sum + parseFloat(payer.amount), 0);
            if (Math.abs(totalPaidAmount - newAmount) > 0.01) {
                return res.status(400).json({
                    success: false,
                    message: `Total paid amount (${totalPaidAmount}) must equal expense amount (${newAmount})`
                });
            }
        }

        if (amount && amount !== expense.amount && !paid_by) {
            return res.status(400).json({
                success: false,
                message: "When changing the expense amount, you must also provide the updated paid_by array"
            });
        }

        const finalAmount = amount || expense.amount;
        const finalPaidBy = paid_by || expense.paid_by;
        const totalPaidAmount = finalPaidBy.reduce((sum, payer) => sum + parseFloat(payer.amount), 0);

        if (Math.abs(totalPaidAmount - finalAmount) > 0.01) {
            return res.status(400).json({
                success: false,
                message: `Total paid amount (${totalPaidAmount}) does not match expense amount (${finalAmount}). Please provide updated paid_by array.`
            });
        }

        // balances delete
        if (expense.expense_type === 'group') {
            await deleteBalancesForExpense(expense_id, expense.group_id);
        } else if (expense.expense_type === 'friend') {
            await deleteBalancesForExpense(expense_id, null, expense.friend_id);
        }

        // Calculate split details to save in Expense document for display if split_among is being updated
        let finalSplitAmong = split_among;
        if (split_among) {
            const calculatedSplits = calculateSplitAmounts(finalAmount, split_type || expense.split_type, split_among);
            finalSplitAmong = split_among.map(member => {
                const calculation = calculatedSplits.find(c => c.user_id.toString() === member.user_id.toString());
                return {
                    ...member,
                    amount: calculation ? calculation.owed_amount : 0,
                    percentage: member.percentage || (calculation ? calculation.split_value : undefined),
                    shares: member.shares || (calculation ? calculation.split_value : undefined)
                };
            });
        }

        // Update expense
        const editExpens = await Expense.findByIdAndUpdate(expense_id, {
            title,
            description,
            amount,
            category,
            paid_by,
            split_among: finalSplitAmong,
            split_type,
            currency
        }, { new: true });

        // Delete old splits 
        await deleteSplitRecords(expense_id);

        await createSplitRecords(
            editExpens,
            paid_by || expense.paid_by,
            split_type || expense.split_type,
            split_among || expense.split_among
        );


        if (expense.expense_type === 'group') {
            await updateBalances(expense_id, expense.group_id);
        } else if (expense.expense_type === 'friend') {
            await updateBalances(expense_id, null, expense.friend_id);
        }


        // if amount changed update group stats
        if (expense.expense_type === 'group' && amount && amount !== oldAmount) {
            const amountDiff = amount - oldAmount;
            await Group.findByIdAndUpdate(expense.group_id, {
                $inc: {
                    'stats.amount': amountDiff
                }
            });
        }

        // Log activity
        await logActivity({
            actor_id: req.user._id,
            action: "EXPENSE_UPDATED",
            entity_type: "expense",
            entity_id: expense._id,
            group_id: expense.group_id || null,
            metadata: {
                amount: editExpens.amount,
                currency: editExpens.currency,
                expense_description: editExpens.title
            }
        });

        //send notification
        let affectedMembers = [];
        if (expense.expense_type === 'group') {
            affectedMembers = await GroupMember.find({
                group_id: expense.group_id,
                leftGroup: false
            });
        } else if (expense.expense_type === 'friend') {
            const friendship = await Friend.findById(expense.friend_id);
            if (friendship) {
                affectedMembers = [
                    { user_id: friendship.requesterId },
                    { user_id: friendship.reciverId }
                ];
            }
        }

        //send notification
        if (affectedMembers.length > 0) {
            notifyExpenseEdited(editExpens, req.user, affectedMembers, oldAmount).catch(err =>
                console.error('Expense edited notification failed:', err)
            );
        }


        if (expense.expense_type === 'group') {
            await deleteCache(cacheKeys.groupSummary(expense.group_id));
            await deleteCache(cacheKeys.groupExpenses(expense.group_id));
        }
        // Invalidate all affected users' caches
        const affectedUserIds = (split_among || expense.split_among).map(s => s.user_id);
        for (const userId of affectedUserIds) {
            await deleteCache(cacheKeys.userBalance(userId));
            await deleteCache(cacheKeys.userDashboard(userId));
        }


        return res.status(200).json({
            success: true,
            message: "Expense edited successfully",
            data: editExpens
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to edit expense",
            error: error.message
        });
    }
}

// Delete Expense
export const deleteExpense = async (req, res) => {
    try {
        const { expense_id } = req.params;

        if (!expense_id) {
            return res.status(400).json({
                success: false,
                message: "Expense ID is required"
            });
        }

        // Check expense exists
        const expense = await Expense.findById(expense_id);
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        // Authorization check 
        if (expense.expense_type === 'group') {
            const member = await GroupMember.findOne({
                group_id: expense.group_id,
                user_id: req.user._id,
                leftGroup: false
            });


            if (!member) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to delete this expense"
                });
            }
        } else if (expense.expense_type === 'friend') {
            const friendship = await Friend.findById(expense.friend_id);

            if (!friendship) {
                return res.status(404).json({
                    success: false,
                    message: "Friendship not found"
                });
            }

            const loggedInUserId = req.user._id.toString();
            const isRequester = friendship.requesterId.toString() === loggedInUserId;
            const isReceiver = friendship.reciverId.toString() === loggedInUserId;

            if (!isRequester && !isReceiver) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to delete this expense"
                });
            }
        }

        // balances delete
        if (expense.expense_type === 'group') {
            await deleteBalancesForExpense(expense_id, expense.group_id);
        } else if (expense.expense_type === 'friend') {
            await deleteBalancesForExpense(expense_id, null, expense.friend_id);
        }


        // Delete split records
        await deleteSplitRecords(expense_id);


        // Delete expense
        const deleteExpens = await Expense.findByIdAndDelete(expense_id);

        // Update group stats
        if (expense.expense_type === 'group') {
            await Group.findByIdAndUpdate(expense.group_id, {
                $inc: {
                    'stats.expense': -1,
                    'stats.amount': -expense.amount
                }
            });
        }

        // Log activity
        await logActivity({
            actor_id: req.user._id,
            action: "EXPENSE_DELETED",
            entity_type: "expense",
            entity_id: expense._id,
            group_id: expense.group_id || null,
            metadata: {
                amount: expense.amount,
                currency: expense.currency,
                expense_description: expense.title
            }
        });

        //send notification
        let affectedMembers = [];
        if (expense.expense_type === 'group') {
            affectedMembers = await GroupMember.find({
                group_id: expense.group_id,
                leftGroup: false
            });
        } else if (expense.expense_type === 'friend') {
            const friendship = await Friend.findById(expense.friend_id);
            if (friendship) {
                affectedMembers = [
                    { user_id: friendship.requesterId },
                    { user_id: friendship.reciverId }
                ];
            }
        }


        //send notification
        if (affectedMembers.length > 0) {
            notifyExpenseDeleted(expense, req.user, affectedMembers).catch(err =>
                console.error('Expense deleted notification failed:', err)
            );
        }


        if (expense.expense_type === 'group') {
            await deleteCache(cacheKeys.groupSummary(expense.group_id));
            await deleteCache(cacheKeys.groupExpenses(expense.group_id));
        }
        // Invalidate all affected users' caches
        for (const member of expense.split_among) {
            await deleteCache(cacheKeys.userBalance(member.user_id));
            await deleteCache(cacheKeys.userDashboard(member.user_id));
        }


        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
            data: deleteExpens
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete expense",
            error: error.message
        });
    }
}

// Get all expenses in a group
export const getGroupExpenses = async (req, res) => {
    try {
        const { group_id } = req.params;
        const { startDate, endDate, minAmount, maxAmount, searchText, category, paid_by, sortBy, sortOrder } = req.query;
        const { page, skip, limit } = getPagination(req);


        if (!group_id) {
            return res.status(400).json({
                success: false,
                message: "Group ID is required"
            });
        }


        // Check if user is member
        const isMember = await GroupMember.findOne({
            group_id,
            user_id: req.user._id,
            leftGroup: false
        });

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group"
            });
        }

        //Build query
        let query = { group_id, expense_type: 'group' };


        // Check if any filters are applied
        const hasFilters = startDate || endDate || minAmount || maxAmount || searchText || category || paid_by;

        //apply filter
        query = applyFilters(query, {
            dateField: 'createdAt',
            startDate,
            endDate,
            amountField: 'amount',
            minAmount,
            maxAmount,
            searchText,
            searchFields: ['title', 'description', 'notes']
        });

        if (category) {
            query.category = category;
        }

        if (paid_by) {
            query['paid_by.user_id'] = paid_by;
        }

        const sort = buildSortObject(sortBy, sortOrder);

        const totalExpenses = await Expense.countDocuments(query);

        if (totalExpenses === 0) {
            if (hasFilters) {
                return res.status(200).json({
                    success: true,
                    message: "No expenses match the applied filters",


                });
            }
            return res.status(404).json({
                success: false,
                message: "You have no expenses in this group"
            });
        }

        const expenses = await Expense.find(query)
            .populate('paid_by.user_id', 'name email')
            .populate('split_among.user_id', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(limit);


        if (expenses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No expenses found on this page"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            data: expenses,
            filters: {
                startDate,
                endDate,
                minAmount,
                maxAmount,
                searchText,
                category,
                paid_by,
                sortBy,
                sortOrder
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get expenses",
            error: error.message
        });
    }
}

//Get all expenses in a friend
export const getFriendExpenses = async (req, res) => {
    try {
        const { friend_id } = req.params;
        const { startDate, endDate, minAmount, maxAmount, searchText, category, paid_by, sortBy, sortOrder } = req.query;
        const userId = req.user._id;
        const { page, skip, limit } = getPagination(req);

        if (!friend_id) {
            return res.status(400).json({
                success: false,
                message: "Friend ID is required"
            });
        }

        // Check friendship
        const friendship = await Friend.findOne({
            _id: friend_id,
            status: "accepted",
            $or: [
                { requesterId: userId },
                { reciverId: userId }
            ]
        });

        if (!friendship) {
            return res.status(403).json({
                success: false,
                message: "You are not a friend of this user"
            });
        }


        //Build query
        let query = { friend_id, expense_type: 'friend' };


        //has filters
        const hasFilters = startDate || endDate || minAmount || maxAmount || searchText || category || paid_by;

        //apply filter
        query = applyFilters(query, {
            dateField: 'createdAt',
            startDate,
            endDate,
            amountField: 'amount',
            minAmount,
            maxAmount,
            searchText,
            searchFields: ['title', 'description', 'notes']
        });

        if (category) {
            query.category = category;
        }

        if (paid_by) {
            query['paid_by.user_id'] = paid_by;
        }

        const sort = buildSortObject(sortBy, sortOrder);
        const totalExpenses = await Expense.countDocuments(query);

        if (totalExpenses === 0) {
            return res.status(200).json({
                success: true,
                message: hasFilters ? "No expenses match the applied filters" : "No expenses with this friend yet",
                data: { expenses: [] }
            });
        }

        const expenses = await Expense.find(query)
            .populate('paid_by.user_id', 'name email')
            .populate('split_among.user_id', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            data: { expenses },
            pagination: {
                page,
                limit,
                total: totalExpenses
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get expenses",
            error: error.message
        });
    }
}

// Get single expense details
export const getExpenseDetails = async (req, res) => {
    try {
        const { expense_id } = req.params;
        const { page, skip, limit } = getPagination(req);


        if (!expense_id) {
            return res.status(400).json({
                success: false,
                message: "Expense ID is required"
            });
        }


        // Get expense
        const expense = await Expense.findById(expense_id)
            .populate('paid_by.user_id', 'name email')
            .populate('split_among.user_id', 'name email')
            .populate('group_id', 'groupName')
            .populate('friend_id')
            .skip(skip)
            .limit(limit);


        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }


        // Check authorization
        if (expense.expense_type === 'group') {
            const isMember = await GroupMember.findOne({
                group_id: expense.group_id,
                user_id: req.user._id,
                leftGroup: false
            });


            if (!isMember) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to view this expense"
                });
            }
        }


        return res.status(200).json({
            success: true,
            message: "Expense details fetched successfully",
            data: expense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get expense details",
            error: error.message
        });
    }
}
