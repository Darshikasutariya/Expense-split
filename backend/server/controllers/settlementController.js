import Settlement from "../models/settlementSchema.js";
import GroupMember from "../models/groupmemberSchema.js";
import Balance from "../models/balanceSchema.js";
import Friend from "../models/friendSchema.js";
import User from "../models/userSchema.js";
import { notifySettlementReceived, notifySettlementCompleted } from "../helpers/notificationHelpers.js";
import { getPagination } from "../helpers/paginationHelper.js";
import { applyFilters, buildSortObject } from '../helpers/filterHelper.js';
import { logActivity } from '../services/activityLogService.js';


//Create Cash payment
export const cashPayment = async (req, res) => {
    try {
        const { amount, paymentDetails } = req.body;
        const fromUser_id = req.user._id;
        const { friend_id, toUser_id, group_id } = req.params;


        if (!toUser_id || !amount) {
            return res.status(400).json({
                success: false,
                message: "toUser_id, amount are required"
            });
        }

        if (!group_id && !friend_id) {
            return res.status(400).json({
                success: false,
                message: "Either group_id or friend_id is required"
            });
        }
        if (group_id && friend_id) {
            return res.status(400).json({
                success: false,
                message: "Provide either group_id OR friend_id, not both"
            });
        }


        // user not own settlement
        if (fromUser_id.toString() === toUser_id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Cannot settle with yourself"
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
        }


        let balance;
        let balanceQuery;
        //group settlement
        if (group_id) {
            const fromMember = await GroupMember.findOne({
                group_id,
                user_id: fromUser_id,
                leftGroup: false
            });


            const toMember = await GroupMember.findOne({
                group_id,
                user_id: toUser_id,
                leftGroup: false
            });


            if (!fromMember || !toMember) {
                return res.status(403).json({
                    success: false,
                    message: "Both users must be active members of the group"
                });
            }


            balanceQuery = {
                fromUser_id,
                toUser_id,
                group_id
            }
            balance = await Balance.findOne(balanceQuery);


            if (!balance) {
                return res.status(404).json({
                    success: false,
                    message: "No balance found. You don't owe this person any money in this group"
                });
            }


            if (amount > balance.amount) {
                return res.status(400).json({
                    success: false,
                    message: `You cannot settle more than you owe. You owe ₹${balance.amount} but trying to settle ₹${amount}`
                });
            }
        }


        //friend settlement
        if (friend_id) {
            const friendship = await Friend.findOne({
                _id: friend_id,
                status: "accepted",
                $or: [
                    { requesterId: fromUser_id, reciverId: toUser_id },
                    { requesterId: toUser_id, reciverId: fromUser_id }
                ]
            });


            if (!friendship) {
                return res.status(403).json({
                    success: false,
                    message: "Friendship not found"
                });
            }

            balanceQuery = {
                fromUser_id,
                toUser_id,
                friend_id
            }
            balance = await Balance.findOne(balanceQuery);


            if (!balance) {
                return res.status(404).json({
                    success: false,
                    message: "No balance found. You don't owe this person any money in this group"
                });
            }


        }

        if (amount > balance.amount) {
            return res.status(400).json({
                success: false,
                message: `You cannot settle more than you owe. You owe ₹${balance.amount.toFixed(2)} but trying to settle ₹${amount.toFixed(2)}`
            });
        }

        //check duplicate settlement        
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        const duplicateCheck = {
            fromUser_id,
            toUser_id,
            amount,
            createdAt: { $gte: oneMinuteAgo }
        };

        if (group_id) duplicateCheck.group_id = group_id;
        if (friend_id) duplicateCheck.friend_id = friend_id;


        const duplicateSettlement = await Settlement.findOne(duplicateCheck);

        if (duplicateSettlement) {
            return res.status(400).json({
                success: false,
                message: "Duplicate settlement detected. Please wait before creating another settlement with same amount"
            });
        }

        const settlement = await Settlement.create({
            group_id,
            friend_id,
            fromUser_id,
            toUser_id,
            amount,
            paymentMethod: 'cash',
            paymentSource: 'manual',
            paymentDetails: {
                note: paymentDetails?.note || 'Cash payment',
                location: paymentDetails?.location || '',
                timestamp: new Date()
            },
            status: 'completed',
            settledAt: Date.now()
        });


        // Update balance
        const oldBalance = balance.amount;
        balance.amount = balance.amount - amount;
        let balanceStatus;


        if (balance.amount <= 0.01) {
            await Balance.findByIdAndDelete(balance._id);
            balanceStatus = 'fully_settled';
        } else {
            balance.lastUpdated = Date.now();
            await balance.save();
            balanceStatus = 'partially_settled';
        }

        await settlement.populate('fromUser_id', 'name email');
        await settlement.populate('toUser_id', 'name email');
        if (group_id) {
            await settlement.populate('group_id', 'groupName');
        }

        const fromUser = await User.findById(settlement.fromUser_id);
        const toUser = await User.findById(settlement.toUser_id);

        // Send notifications
        if (fromUser && toUser) {

            notifySettlementReceived(settlement, fromUser, toUser).catch(err =>
                console.error('Settlement received notification failed:', err)
            );

            notifySettlementCompleted(settlement, fromUser, toUser).catch(err =>
                console.error('Settlement completed notification failed:', err)
            );
        }


        let previousBalance = parseFloat(oldBalance.toFixed(2));
        let settledAmount = parseFloat(amount.toFixed(2));
        let remainingBalance = balance.amount > 0 ? parseFloat(balance.amount.toFixed(2)) : 0;


        // log activity
        await logActivity({
            actor_id: req.user._id,
            action: "SETTLEMENT_RECORDED",
            entity_type: "settlement",
            entity_id: settlement._id,
            group_id: group_id || null,
            target_user_id: toUser_id,
            metadata: {
                amount: amount,
                currency: 'INR',
                balance_effect: 'YOU_PAID',
                previousBalance,
                settledAmount,
                remainingBalance,
                balanceStatus
            }
        });


        return res.status(200).json({
            success: true,
            message: "Cash settlement created successfully",
            data: {
                settlement: settlement,
                balanceInfo: {
                    previousBalance,
                    settledAmount,
                    remainingBalance,
                    balanceStatus
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create cash settlement",
            error: error.message
        });
    }
}


// Get Group Settlements
export const getGroupSettlements = async (req, res) => {
    try {
        const { group_id } = req.params;
        const { startDate, endDate, minAmount, maxAmount, paymentMethod, status, fromUserId, toUserId, sortBy, sortOrder } = req.query;
        const { page, skip, limit } = getPagination(req);

        if (!group_id) {
            return res.status(400).json({
                success: false,
                message: "group_id is required"
            });
        }
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

        //Build Query
        let query = { group_id };


        //apply filter
        query = applyFilters(query, {
            dateField: 'createdAt',
            startDate,
            endDate,
            amountField: 'amount',
            minAmount,
            maxAmount,
            statusField: 'status',
            status
        })

        //has filters
        const hasFilters = startDate || endDate || minAmount || maxAmount || paymentMethod || status || fromUserId || toUserId;

        if (paymentMethod) {
            query.paymentMethod = paymentMethod;
        }

        if (fromUserId) {
            query.fromUser_id = fromUserId;
        }

        if (toUserId) {
            query.toUser_id = toUserId;
        }

        const totalSettlements = await Settlement.countDocuments(query);

        if (totalSettlements === 0) {
            if (hasFilters) {
                return res.status(200).json({
                    success: true,
                    message: "No settlements match the applied filters",


                });
            }
            return res.status(200).json({
                success: true,
                message: "No settlements found",


            });
        }

        const sort = buildSortObject(sortBy, sortOrder);


        const settlements = await Settlement.find(query)
            .populate('fromUser_id', 'name email')
            .populate('toUser_id', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(limit);


        return res.status(200).json({
            success: true,
            message: "Settlements fetched successfully",
            data: settlements,
            filters: {
                startDate,
                endDate,
                minAmount,
                maxAmount,
                paymentMethod,
                fromUserId,
                toUserId,
                sortBy,
                sortOrder
            }



        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get settlements",
            error: error.message
        });
    }
}
//Get Friend Settlemnets
export const getFriendSettlements = async (req, res) => {
    try {
        const { friend_id } = req.params;
        const { startDate, endDate, minAmount, maxAmount, paymentMethod, status, fromUserId, toUserId, sortBy, sortOrder } = req.query;
        const user_id = req.user._id;
        const { page, skip, limit } = getPagination(req);


        if (!friend_id) {
            return res.status(400).json({
                success: false,
                message: "friend_id is required"
            });
        }

        const friendship = await Friend.findOne({
            _id: friend_id,
            status: "accepted",
            $or: [
                { requesterId: user_id },
                { reciverId: user_id }
            ]
        });


        if (!friendship) {
            return res.status(403).json({
                success: false,
                message: "Friendship not found or not accepted"
            });
        }


        //Build Query
        let query = { friend_id };

        //apply filter
        query = applyFilters(query, {
            dateField: 'createdAt',
            startDate,
            endDate,
            amountField: 'amount',
            minAmount,
            maxAmount,
            statusField: 'status',
            status
        })


        //has filters
        const hasFilters = startDate || endDate || minAmount || maxAmount || paymentMethod || status || fromUserId || toUserId;

        if (paymentMethod) {
            query.paymentMethod = paymentMethod;
        }
        if (fromUserId) {
            query.fromUser_id = fromUserId;
        }
        if (toUserId) {
            query.toUser_id = toUserId;
        }
        const sort = buildSortObject(sortBy, sortOrder);
        const totalSettlements = await Settlement.countDocuments(query);

        if (totalSettlements === 0) {
            if (hasFilters) {
                return res.status(200).json({
                    success: true,
                    message: "No settlements match the applied filters"
                });
            }
            return res.status(200).json({
                success: true,
                message: "No settlements found with this friend"
            });
        }

        const settlements = await Settlement.find(query)
            .populate('fromUser_id', 'name email')
            .populate('toUser_id', 'name email')
            .sort(sort)
            .skip(skip)
            .limit(limit);


        return res.status(200).json({
            success: true,
            message: "Settlements fetched successfully",
            data: settlements,
            filters: {
                startDate,
                endDate,
                minAmount,
                maxAmount,
                paymentMethod,
                status,
                fromUserId,
                toUserId,
                sortBy,
                sortOrder
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get settlements",
            error: error.message
        });
    }
}

// Get Settlement Details
export const getSettlementDetails = async (req, res) => {
    try {
        const { settlement_id } = req.params;
        const { page, skip, limit } = getPagination(req);


        if (!settlement_id) {
            return res.status(400).json({
                success: false,
                message: "settlement_id is required"
            });
        }

        const settlement = await Settlement.findById(settlement_id)
            .populate('fromUser_id', 'name email')
            .populate('toUser_id', 'name email')
            .populate('group_id', 'groupName')
            .skip(skip)
            .limit(limit);


        if (!settlement) {
            return res.status(404).json({
                success: false,
                message: "Settlement not found"
            });
        }

        const userId = req.user._id.toString();
        if (settlement.fromUser_id._id.toString() !== userId &&
            settlement.toUser_id._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this settlement"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Settlement details fetched successfully",
            data: settlement
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get settlement details",
            error: error.message
        });
    }
}
