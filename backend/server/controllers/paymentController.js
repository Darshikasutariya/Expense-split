import Balance from '../models/balanceSchema.js';
import GroupMember from '../models/groupmemberSchema.js';
import Friend from '../models/friendSchema.js';
import Payment from '../models/paymentSchema.js';
import Settlement from '../models/settlementSchema.js';
import User from '../models/userSchema.js';
import { publishPaymentRequest } from '../pubsub/paymentPublisher.js';
import { getPagination } from '../helpers/paginationHelper.js';
import { applyFilters, buildSortObject } from '../helpers/filterHelper.js';
import { notifySettlementReceived, notifySettlementCompleted } from '../helpers/notificationHelpers.js';
import { logActivity } from '../services/activityLogService.js';

const updateBalanceAfterPayment = async (balance, amount) => {
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

    return {
        previousBalance: parseFloat(oldBalance.toFixed(2)),
        settledAmount: parseFloat(amount.toFixed(2)),
        remainingBalance: balance.amount > 0 ? parseFloat(balance.amount.toFixed(2)) : 0,
        balanceStatus
    };
};

const validatePaymentContext = async (req, group_id, friend_id, toUser_id, amount) => {
    const fromUser_id = req.user._id;

    // Basic validation
    if (!toUser_id || !amount || amount <= 0) {
        throw new Error("toUser_id and amount > 0 are required");
    }
    if (fromUser_id.toString() === toUser_id.toString()) {
        throw new Error("Cannot pay yourself");
    }
    if (!group_id && !friend_id) {
        throw new Error("Either group_id or friend_id is required");
    }
    if (group_id && friend_id) {
        throw new Error("Provide either group_id OR friend_id, not both");
    }

    // Group validation
    if (group_id) {
        const [fromMember, toMember] = await Promise.all([
            GroupMember.findOne({ group_id, user_id: fromUser_id, leftGroup: false }),
            GroupMember.findOne({ group_id, user_id: toUser_id, leftGroup: false })
        ]);
        if (!fromMember || !toMember) {
            throw new Error("Both users must be active group members");
        }
    }

    // Friend validation
    if (friend_id) {
        const friendship = await Friend.findOne({
            _id: friend_id, status: "accepted",
            $or: [
                { requesterId: fromUser_id, reciverId: toUser_id },
                { requesterId: toUser_id, reciverId: fromUser_id }
            ]
        });
        if (!friendship) {
            throw new Error("Friendship not found or not accepted");
        }
    }
};

export const handlePaymentCompleted = async (payload) => {
    try {
        console.log('Processing payment:completed event');
        console.log('  Event:', payload.event);

        const { user_id, toUser_id, amount, group_id, friend_id, paymentId, paymentIntentId, status } = payload.data;

        console.log('  Payment ID:', paymentId);
        console.log('  From User:', user_id);
        console.log('  To User:', toUser_id);
        console.log('  Amount: ₹', amount);
        console.log('  Status:', status);

        // Check if settlement already exists for this payment
        const existingSettlement = await Settlement.findOne({
            'paymentDetails.payment_id': paymentId
        });

        if (existingSettlement) {
            console.log('Settlement already exists for this payment, skipping...');
            return;
        }

        // Find the balance record
        const balanceQuery = {
            fromUser_id: user_id,
            toUser_id: toUser_id
        };

        if (group_id) balanceQuery.group_id = group_id;
        if (friend_id) balanceQuery.friend_id = friend_id;

        const balance = await Balance.findOne(balanceQuery);

        if (!balance) {
            console.error('No balance found for this payment');
            return;
        }

        console.log('  Previous Balance: ₹', balance.amount.toFixed(2));

        // Validate amount doesn't exceed balance
        if (amount > balance.amount) {
            console.error(`Payment amount (₹${amount}) exceeds balance (₹${balance.amount})`);
            return;
        }

        // Create settlement record
        const settlement = await Settlement.create({
            group_id: group_id || null,
            friend_id: friend_id || null,
            fromUser_id: user_id,
            toUser_id: toUser_id,
            amount: amount,
            paymentMethod: 'card',
            paymentSource: 'gateway',
            paymentDetails: {
                stripePaymentIntentId: paymentIntentId,
                payment_id: paymentId,
                processedAt: new Date(),
                gatewayStatus: status
            },
            status: 'completed',
            settledAt: new Date()
        });

        console.log('Settlement created:', settlement._id);

        // Update balance using helper function
        const balanceInfo = await updateBalanceAfterPayment(balance, amount);
        console.log(`Balance ${balanceInfo.balanceStatus}`);

        // Populate settlement for notifications
        await settlement.populate('fromUser_id', 'name email');
        await settlement.populate('toUser_id', 'name email');
        if (group_id) {
            await settlement.populate('group_id', 'groupName');
        }

        const fromUser = await User.findById(user_id);
        const toUser = await User.findById(toUser_id);

        // Send notifications
        if (fromUser && toUser) {
            notifySettlementReceived(settlement, fromUser, toUser).catch(err =>
                console.error('Settlement received notification failed:', err)
            );

            notifySettlementCompleted(settlement, fromUser, toUser).catch(err =>
                console.error('Settlement completed notification failed:', err)
            );
        }

        // Log activity
        await logActivity({
            actor_id: user_id,
            action: "SETTLEMENT_RECORDED",
            entity_type: "settlement",
            entity_id: settlement._id,
            group_id: group_id || null,
            target_user_id: toUser_id,
            metadata: {
                amount: amount,
                currency: 'INR',
                balance_effect: 'YOU_PAID',
                previousBalance: balanceInfo.previousBalance,
                settledAmount: balanceInfo.settledAmount,
                remainingBalance: balanceInfo.remainingBalance,
                balanceStatus: balanceInfo.balanceStatus,
                paymentSource: 'gateway',
                paymentMethod: 'card'
            }
        });

        console.log('Payment completed event processed successfully\n');

    } catch (error) {
        console.error('Error handling payment:completed:', error.message);
        console.error(error.stack);
    }
};

export const handlePaymentFailed = async (payload) => {
    try {
        console.log('Processing payment:failed event');
        console.log('  Event:', payload.event);

        const { user_id, amount, error } = payload.data;

        console.log('  User:', user_id);
        console.log('  Amount: ₹', amount);
        console.log('  Error:', error);

        // Log activity for failed payment
        await logActivity({
            actor_id: user_id,
            action: "PAYMENT_FAILED",
            entity_type: "payment",
            entity_id: null,
            group_id: payload.data.group_id || null,
            target_user_id: payload.data.toUser_id || null,
            metadata: {
                amount: amount,
                currency: 'INR',
                error: error,
                paymentSource: 'gateway'
            }
        });

        console.log('Payment failed event logged\n');

    } catch (error) {
        console.error('Error handling payment:failed:', error.message);
        console.error(error.stack);
    }
};


export const createOnlinePayment = async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;
        const fromUser_id = req.user._id;
        const { friend_id, toUser_id, group_id } = req.params;

        // Validate payment method
        if (!['card', 'upi', 'netbanking'].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method (card/upi/netbanking only)"
            });
        }

        await validatePaymentContext(req, group_id, friend_id, toUser_id, amount);

        // Find balance
        const balanceQuery = {
            fromUser_id,
            toUser_id,
            ...(group_id && { group_id }),
            ...(friend_id && { friend_id })
        };
        const balance = await Balance.findOne(balanceQuery);

        if (!balance) {
            return res.status(404).json({
                success: false,
                message: "No outstanding balance found"
            });
        }

        // Validate amount
        if (amount > balance.amount) {
            return res.status(400).json({
                success: false,
                message: `Amount exceeds balance. You owe ₹${balance.amount.toFixed(2)}, requested ₹${amount.toFixed(2)}`
            });
        }

        // Create unique request ID for tracking this payment
        const requestId = `${fromUser_id}_${Date.now()}`;

        // Publish payment request to payment server via Redis
        const paymentData = {
            requestId,
            user_id: fromUser_id.toString(),
            toUser_id: toUser_id.toString(),
            amount: parseFloat(amount),
            paymentMethod,
            group_id: group_id || null,
            friend_id: friend_id || null
        };

        const publishResult = await publishPaymentRequest(paymentData);

        if (!publishResult.success) {
            return res.status(500).json({
                success: false,
                message: "Failed to initiate payment request",
                error: publishResult.error
            });
        }

        // Wait for payment result (with timeout)
        const paymentResult = await new Promise((resolve) => {
            const timeout = setTimeout(() => {
                delete global.paymentResolvers?.[requestId];
                resolve({ success: false, error: 'Payment timeout' });
            }, 30000); // 30 second timeout

            // Store resolver to be called by payment subscriber
            global.paymentResolvers = global.paymentResolvers || {};
            global.paymentResolvers[requestId] = (result) => {
                clearTimeout(timeout);
                delete global.paymentResolvers[requestId];
                resolve(result);
            };
        });

        if (!paymentResult.success) {
            return res.status(400).json({
                success: false,
                message: "Payment failed",
                error: paymentResult.error,
                data: {
                    amount: parseFloat(amount.toFixed(2)),
                    paymentMethod,
                    currentBalance: parseFloat(balance.amount.toFixed(2)),
                    status: 'failed'
                }
            });
        }

        // Payment succeeded
        const remainingBalance = balance.amount - amount;
        return res.status(200).json({
            success: true,
            message: "Payment completed successfully!",
            data: {
                amount: parseFloat(amount.toFixed(2)),
                paymentMethod,
                paymentId: paymentResult.paymentId,
                remainingBalance: parseFloat(remainingBalance.toFixed(2)),
                status: 'completed'
            }
        });

    } catch (error) {
        console.error('Create online payment error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create online payment"
        });
    }
};

//payment details
export const getPaymentDetails = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId)
            .populate('user_id', 'name email')
            .populate('toUser_id', 'name email')
            .populate('group_id', 'groupName');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        // Authorization check
        const userId = req.user._id.toString();
        if (payment.user_id._id.toString() !== userId && payment.toUser_id._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment details fetched successfully",
            data: payment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//all payments
export const allPayments = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { status, sortBy, sortOrder, paymentMethod, startDate, endDate, minAmount, maxAmount, allUserPayments = false } = req.query;
        const { page, skip, limit } = getPagination(req);

        // Build query
        let query = allUserPayments === 'true'
            ? { $or: [{ user_id: user_id }, { toUser_id: user_id }] }
            : { user_id: user_id };

        // Apply filters
        query = applyFilters(query, {
            dateField: 'createdAt', startDate, endDate,
            amountField: 'amount', minAmount, maxAmount,
            statusField: 'status', status
        });

        if (paymentMethod) query.paymentMethod = paymentMethod;

        const totalCount = await Payment.countDocuments(query);
        if (totalCount === 0) {
            return res.status(200).json({
                success: true,
                message: "No payments found"
            });
        }

        const sort = buildSortObject(sortBy || 'createdAt', sortOrder);
        const payments = await Payment.find(query)
            .populate('user_id', 'name email')
            .populate('toUser_id', 'name email')
            .populate('group_id', 'groupName')
            .sort(sort).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            data: payments,
            totalCount,
            pagination: { page, limit },
            filters: { status, paymentMethod, startDate, endDate, minAmount, maxAmount, sortBy, sortOrder }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default {
    createOnlinePayment,
    getPaymentDetails,
    allPayments,
    handlePaymentCompleted,
    handlePaymentFailed
};
