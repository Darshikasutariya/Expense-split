import GroupMember from "../models/groupmemberSchema.js";
import Expense from "../models/expenseSchema.js";
import Expense_Split from "../models/expense_splitSchema.js";
import Friend from "../models/friendSchema.js";


// Calculate split amounts based on split_type
export const calculateSplitAmounts = (totalAmount, split_type, split_among) => {
    switch (split_type) {
        case 'equal':
            return calculateEqualSplit(totalAmount, split_among);


        case 'exact':
            return calculateExactSplit(totalAmount, split_among);


        case 'percentage':
            return calculatePercentageSplit(totalAmount, split_among);


        case 'shares':
            return calculateSharesSplit(totalAmount, split_among);


        default:
            throw new Error('Invalid split_type');
    }
};


// Equal split calculation
const calculateEqualSplit = (totalAmount, split_among) => {
    const perPersonAmount = totalAmount / split_among.length;


    return split_among.map((person) => {
        return {
            user_id: person.user_id,
            split_value: perPersonAmount,
            owed_amount: parseFloat(perPersonAmount.toFixed(2))
        }
    })
}

// Exact split calculation
const calculateExactSplit = (totalAmount, split_among) => {
    const total = split_among.reduce((acc, person) => {
        const exactValue = parseFloat(person.amount || person.exact || 0);
        return acc + exactValue;
    }, 0);

    if (Math.abs(total - totalAmount) > 0.01) {
        throw new Error(`Exact split amounts (${total}) must equal total expense amount (${totalAmount})`);
    }


    return split_among.map((person) => {
        const value = parseFloat(person.amount || person.exact);
        return {
            user_id: person.user_id,
            split_value: value,
            owed_amount: value
        }
    })
}
// Percentage split calculation
const calculatePercentageSplit = (totalAmount, split_among) => {
    const totalPercentage = split_among.reduce((acc, person) => acc + parseFloat(person.percentage || 0), 0);

    // percentages sum is 100
    if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new Error('Percentages must sum to 100');
    }


    return split_among.map((person) => {
        const percentage = parseFloat(person.percentage);
        const owedAmount = (totalAmount * percentage) / 100;
        return {
            user_id: person.user_id,
            split_value: percentage,
            owed_amount: parseFloat(owedAmount.toFixed(2))
        }
    })
}
// Shares split calculation
const calculateSharesSplit = (totalAmount, split_among) => {
    const totalShares = split_among.reduce((acc, person) => acc + parseFloat(person.shares || 0), 0);
    const amountPerShare = totalAmount / totalShares;


    return split_among.map(person => {
        const shares = parseFloat(person.shares || 1);
        const owedAmount = amountPerShare * shares;
        return {
            user_id: person.user_id,
            split_value: shares,
            owed_amount: parseFloat(owedAmount.toFixed(2))
        };
    })
}
// Create split records 
export const createSplitRecords = async (expense, paid_by, split_type, split_among) => {
    try {
        const splitCalculations = calculateSplitAmounts(expense.amount, split_type, split_among);

        const paidByMap = {};
        paid_by.forEach(payer => {
            paidByMap[payer.user_id.toString()] = parseFloat(payer.amount);
        });

        const splitRecords = [];
        for (const split of splitCalculations) {
            const paid_amount = paidByMap[split.user_id.toString()] || 0;
            const balance_amount = paid_amount - split.owed_amount;

            const newRecord = await Expense_Split.create({
                expense_id: expense._id,
                user_id: split.user_id,
                group_id: expense.expense_type === 'group' ? expense.group_id : null,
                friend_id: expense.expense_type === 'friend' ? expense.friend_id : null,
                split_type,
                split_value: split.split_value,
                owed_amount: split.owed_amount,
                paid_amount,
                balance_amount
            });
            splitRecords.push(newRecord);
        }

        return splitRecords;
    } catch (error) {
        throw new Error(`Failed to create split records: ${error.message}`);
    }
}
// Get split amount 
export const getSplitAmount = async (req, res) => {
    try {
        const { expense_id } = req.params;

        if (!expense_id) {
            return res.status(400).json({
                success: false,
                message: "Expense id is required"
            })
        }

        const expense = await Expense.findById(expense_id);
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            })
        }

        // Authorization check
        if (expense.expense_type === 'group') {
            const isMember = await GroupMember.findOne({
                group_id: expense.group_id,
                user_id: req.user._id,
                leftGroup: false
            });

            if (!isMember) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to view this expense splits"
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

            const user_id = req.user._id.toString();

            if (friendship.requesterId.toString() !== user_id && friendship.reciverId.toString() !== user_id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to view this expense splits"
                });
            }
        }
        const splits = await Expense_Split.find({ expense_id }).populate('user_id', 'name email');

        return res.status(200).json({
            success: true,
            message: "Split amount fetched successfully",
            data: splits
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get split amount",
            error: error.message
        })
    }
}

export const deleteSplitRecords = async (expense_id) => {
    try {
        const splits = await Expense_Split.deleteMany({ expense_id });
        return splits;
    } catch (error) {
        throw new Error(`Failed to delete split records: ${error.message}`);
    }
}