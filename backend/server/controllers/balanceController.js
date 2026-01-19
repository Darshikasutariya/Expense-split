import Balance from "../models/balanceSchema.js";
import Expense_Split from "../models/expense_splitSchema.js";
import GroupMember from "../models/groupmemberSchema.js";
import Friend from "../models/friendSchema.js";


//helper function
const calculateCreditorsAndDebtors = (splits) => {
    const creditors = [];
    const debtors = [];


    splits.forEach(split => {
        if (split.balance_amount > 0) {
            creditors.push({
                user_id: split.user_id,
                amount: split.balance_amount
            });
        } else if (split.balance_amount < 0) {
            debtors.push({
                user_id: split.user_id,
                amount: Math.abs(split.balance_amount)
            });
        }
    });


    return { creditors, debtors };
};

//batchfetch balances function
const batchFetchBalances = async (debtors, creditors, group_id, friend_id) => {
    const debtorIds = debtors.map(d => d.user_id);
    const creditorIds = creditors.map(c => c.user_id);


    const balances = await Balance.find({
        fromUser_id: { $in: debtorIds },
        toUser_id: { $in: creditorIds },
        group_id: group_id || null,
        friend_id: friend_id || null
    });


    const balanceMap = new Map();
    balances.forEach(balance => {
        const key = `${balance.fromUser_id}-${balance.toUser_id}`;
        balanceMap.set(key, balance);
    });


    return balanceMap;
};

//update balances after expense add/edit
export const updateBalances = async (expense_id, group_id = null, friend_id = null) => {
    try {
        const splits = await Expense_Split.find({ expense_id });
        const { creditors, debtors } = calculateCreditorsAndDebtors(splits);

        const balanceMap = await batchFetchBalances(debtors, creditors, group_id, friend_id);
        const totalCreditorAmount = creditors.reduce((sum, c) => sum + c.amount, 0);

        const balancesToUpdate = [];
        const balancesToCreate = [];

        for (const debtor of debtors) {
            for (const creditor of creditors) {
                if (debtor.user_id.toString() === creditor.user_id.toString()) {
                    console.log("No payment with self")
                    continue;
                }

                const shareRatio = creditor.amount / totalCreditorAmount;
                const amountOwed = debtor.amount * shareRatio;

                if (amountOwed > 0.01) {
                    const key = `${debtor.user_id}-${creditor.user_id}`;
                    const existingBalance = balanceMap.get(key);

                    if (existingBalance) {
                        existingBalance.amount += amountOwed;
                        existingBalance.lastUpdated = Date.now();
                        balancesToUpdate.push(existingBalance);
                    } else {
                        balancesToCreate.push({
                            fromUser_id: debtor.user_id,
                            toUser_id: creditor.user_id,
                            group_id: group_id || null,
                            friend_id: friend_id || null,
                            amount: amountOwed,
                            type: "debit"
                        });
                    }
                }
            }
        }

        //batch saveall update
        if (balancesToUpdate.length > 0) {
            await Promise.all(balancesToUpdate.map(b => b.save()));
        }
        if (balancesToCreate.length > 0) {
            await Balance.insertMany(balancesToCreate);
        }


        return true;
    } catch (error) {
        throw new Error(`Failed to update balances: ${error.message}`);
    }
};

//delete balances
export const deleteBalancesForExpense = async (expense_id, group_id = null, friend_id = null) => {
    try {
        const splits = await Expense_Split.find({ expense_id });
        const { creditors, debtors } = calculateCreditorsAndDebtors(splits);

        //batch fetch existing balances
        const balanceMap = await batchFetchBalances(debtors, creditors, group_id, friend_id);
        const totalCreditorAmount = creditors.reduce((sum, c) => sum + c.amount, 0);

        const balancesToUpdate = [];
        const balanceIdsToDelete = [];

        for (const debtor of debtors) {
            for (const creditor of creditors) {
                if (debtor.user_id.toString() === creditor.user_id.toString()) {
                    continue;
                }

                const shareRatio = creditor.amount / totalCreditorAmount;
                const amountOwed = debtor.amount * shareRatio;

                if (amountOwed > 0.01) {
                    const key = `${debtor.user_id}-${creditor.user_id}`;
                    const existingBalance = balanceMap.get(key);

                    if (existingBalance) {
                        existingBalance.amount -= amountOwed;

                        if (existingBalance.amount <= 0.01) {
                            balanceIdsToDelete.push(existingBalance._id);
                        } else {
                            existingBalance.lastUpdated = Date.now();
                            balancesToUpdate.push(existingBalance);
                        }
                    }
                }
            }
        }

        //batch delete and update
        if (balanceIdsToDelete.length > 0) {
            await Balance.deleteMany({ _id: { $in: balanceIdsToDelete } });
        }
        if (balancesToUpdate.length > 0) {
            await Promise.all(balancesToUpdate.map(b => b.save()));
        }
        return true;

    } catch (error) {
        throw new Error(`Failed to delete balances: ${error.message}`);
    }
};

//get all balances in a group
export const getGroupBalances = async (req, res) => {
    try {
        const { group_id } = req.params;
        const user_id = req.user._id.toString();

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

        const balances = await Balance.find({ group_id })
            .populate('fromUser_id', 'name email')
            .populate('toUser_id', 'name email')
            .sort({ amount: -1 });

        let youOwe = 0;
        let youGet = 0;

        const ledger = balances.map(b => {
            let fromSelf = b.fromUser_id._id.toString() === user_id;
            let toSelf = b.toUser_id._id.toString() === user_id;


            if (fromSelf) youOwe += b.amount;
            if (toSelf) youGet += b.amount;

            return {
                from: {
                    _id: b.fromUser_id._id,
                    name: b.fromUser_id.name
                },
                to: {
                    _id: b.toUser_id._id,
                    name: b.toUser_id.name
                },
                amount: b.amount,
                type: fromSelf ? "debit" : toSelf ? "credit" : "other",
                createdAt: b.createdAt
            }
        });

        const net = youGet - youOwe;

        return res.status(200).json({
            success: true,
            message: "Group balances fetched successfully",
            data: ledger,
            summary: {
                youOwe,
                youGet,
                net,
                status: net > 0 ? "gets back" : net < 0 ? "owes" : "settled"
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get group balances",
            error: error.message
        });
    }
};

//get friend balance
export const getFriendBalance = async (req, res) => {
    try {
        const { friend_id } = req.params;
        const user_id = req.user._id.toString();

        if (!friend_id) {
            return res.status(400).json({
                success: false,
                message: "friend_id is required"
            });
        }

        const friendship = await Friend.findOne({
            _id: friend_id,
            $or: [
                { requesterId: user_id },
                { reciverId: user_id }
            ],
            status: "accepted"
        });

        if (!friendship) {
            return res.status(403).json({
                success: false,
                message: "You are not a friend of this user"
            });
        }

        const balances = await Balance.find({ friend_id })
            .populate('fromUser_id', 'name email')
            .populate('toUser_id', 'name email')
            .sort({ amount: -1 });

        let youOwe = 0;
        let youGet = 0;

        const ledger = balances.map(b => {
            let fromSelf = b.fromUser_id._id.toString() === user_id;
            let toSelf = b.toUser_id._id.toString() === user_id;

            if (fromSelf) youOwe += b.amount;
            if (toSelf) youGet += b.amount;

            return {
                from: {
                    _id: b.fromUser_id._id,
                    name: b.fromUser_id.name
                },
                to: {
                    _id: b.toUser_id._id,
                    name: b.toUser_id.name
                },
                amount: b.amount,
                type: fromSelf ? "debit" : toSelf ? "credit" : "other",
                createdAt: b.createdAt
            }
        });
        const net = youGet - youOwe;
        return res.status(200).json({
            success: true,
            message: "Friend balances fetched successfully",
            data: ledger,
            summary: {
                youOwe,
                youGet,
                net,
                status: net > 0 ? "gets back" : net < 0 ? "owes" : "settled"
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get friend balances",
            error: error.message
        });
    }
};

//get specific user's balance in a group
export const getUserGroupBalance = async (req, res) => {
    try {
        const { group_id } = req.params;
        const user_id = req.user._id.toString();

        if (!group_id) {
            return res.status(400).json({
                success: false,
                message: "group_id is required"
            });
        }

        const isMember = await GroupMember.findOne({
            group_id,
            user_id,
            leftGroup: false
        });

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group"
            });
        }

        const owesBalances = await Balance.find({
            group_id,
            fromUser_id: user_id
        }).populate('toUser_id', 'name email');

        const getsBalances = await Balance.find({
            group_id,
            toUser_id: user_id
        }).populate('fromUser_id', 'name email');

        const owesLedger = owesBalances.map(b => ({
            from: {
                _id: user_id,
                name: req.user.name
            },
            to: {
                _id: b.toUser_id._id,
                name: b.toUser_id.name
            },
            amount: b.amount,
            type: 'debit',
            createdAt: b.createdAt
        }));

        const getsLedger = getsBalances.map(b => ({
            from: {
                _id: b.fromUser_id._id,
                name: b.fromUser_id.name
            },
            to: {
                _id: user_id,
                name: req.user.name
            },
            amount: b.amount,
            type: 'credit',
            createdAt: b.createdAt
        }));

        const youOwe = owesBalances.reduce((sum, b) => sum + b.amount, 0);
        const youGet = getsBalances.reduce((sum, b) => sum + b.amount, 0);
        const net = youGet - youOwe;

        return res.status(200).json({
            success: true,
            message: "User balance fetched successfully",
            data: {
                owes: owesLedger,
                gets: getsLedger,
                summary: {
                    youOwe: parseFloat(youOwe.toFixed(2)),
                    youGet: parseFloat(youGet.toFixed(2)),
                    net: parseFloat(net.toFixed(2)),
                    status: net > 0 ? "gets back" : net < 0 ? "owes" : "settled"
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get user balance",
            error: error.message
        });
    }
};

//simplify debts 
export const simplifyBalances = async (req, res) => {
    try {
        const { group_id, friend_id } = req.params;

        if (!group_id && !friend_id) {
            return res.status(400).json({
                success: false,
                message: "Either group_id or friend_id is required"
            });
        }

        if (group_id && friend_id) {
            return res.status(400).json({
                success: false,
                message: "Please provide either group_id or friend_id, not both"
            });
        }

        let balances;
        let contextType;

        if (group_id) {
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

            balances = await Balance.find({ group_id })
                .populate('fromUser_id', 'name email')
                .populate('toUser_id', 'name email');

            contextType = "group";
        }

        if (friend_id) {
            const friendship = await Friend.findOne({
                _id: friend_id,
                $or: [
                    { requesterId: req.user._id },
                    { reciverId: req.user._id }
                ],
                status: "accepted"
            });


            if (!friendship) {
                return res.status(403).json({
                    success: false,
                    message: "You are not a friend of this user"
                });
            }

            balances = await Balance.find({ friend_id })
                .populate('fromUser_id', 'name email')
                .populate('toUser_id', 'name email');

            contextType = "friend";
        }
        const userBalances = {};

        balances.forEach(balance => {
            const fromUserId = balance.fromUser_id._id.toString();
            const toUserId = balance.toUser_id._id.toString();

            if (!userBalances[fromUserId]) {
                userBalances[fromUserId] = {
                    user: balance.fromUser_id,
                    netBalance: 0
                };
            }
            if (!userBalances[toUserId]) {
                userBalances[toUserId] = {
                    user: balance.toUser_id,
                    netBalance: 0
                };
            }

            userBalances[fromUserId].netBalance -= balance.amount;
            userBalances[toUserId].netBalance += balance.amount;
        });

        const debtors = [];
        const creditors = [];

        Object.values(userBalances).forEach(userBalance => {
            if (userBalance.netBalance < -0.01) {
                debtors.push({
                    user: userBalance.user,
                    amount: Math.abs(userBalance.netBalance)
                });
            } else if (userBalance.netBalance > 0.01) {
                creditors.push({
                    user: userBalance.user,
                    amount: userBalance.netBalance
                });
            }
        });

        const simplifiedTransactions = [];

        let i = 0, j = 0;
        while (i < debtors.length && j < creditors.length) {
            const debt = debtors[i].amount;
            const credit = creditors[j].amount;
            const settled = Math.min(debt, credit);

            simplifiedTransactions.push({
                from: {
                    _id: debtors[i].user._id,
                    name: debtors[i].user.name
                },
                to: {
                    _id: creditors[j].user._id,
                    name: creditors[j].user.name
                },
                amount: parseFloat(settled.toFixed(2)),
                type: 'debit'
            });

            debtors[i].amount -= settled;
            creditors[j].amount -= settled;

            if (debtors[i].amount < 0.01) i++;
            if (creditors[j].amount < 0.01) j++;
        }

        const currentUserId = req.user._id.toString();
        const userOwes = simplifiedTransactions.filter(t =>
            t.from._id.toString() === currentUserId
        );
        const userGets = simplifiedTransactions.filter(t =>
            t.to._id.toString() === currentUserId
        );

        const youOwe = userOwes.reduce((sum, t) => sum + t.amount, 0);
        const youGet = userGets.reduce((sum, t) => sum + t.amount, 0);
        const net = youGet - youOwe;

        const userOwesWithType = userOwes.map(t => ({
            ...t,
            type: 'debit',
            description: `You owe ${t.to.name}`
        }));

        const userGetsWithType = userGets.map(t => ({
            ...t,
            type: 'credit',
            description: `${t.from.name} owes you`
        }));

        return res.status(200).json({
            success: true,
            message: `${contextType === 'group' ? 'Group' : 'Friend'} debts simplified successfully`,
            data: {
                context: contextType,
                originalTransactions: balances.length,
                simplifiedTransactions: simplifiedTransactions.length,
                allTransactions: simplifiedTransactions,
                yourBalance: {
                    owes: userOwesWithType,
                    gets: userGetsWithType,
                    summary: {
                        youOwe: parseFloat(youOwe.toFixed(2)),
                        youGet: parseFloat(youGet.toFixed(2)),
                        net: parseFloat(net.toFixed(2)),
                        status: net > 0 ? "gets back" : net < 0 ? "owes" : "settled"
                    }
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to simplify debts",
            error: error.message
        });
    }
};
