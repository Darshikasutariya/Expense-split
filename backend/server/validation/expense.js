import Joi from "joi";

export const addExpenseSchema = Joi.object({
    expense_type: Joi.string().valid('group', 'friend').required(),
    title: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    amount: Joi.number().min(0.01).required(),
    category: Joi.string().valid('food', 'travel', 'entertainment', 'utilities', 'shopping', 'health', 'other').optional(),
    paid_by: Joi.array().items(
        Joi.object({
            user_id: Joi.string().hex().length(24).required(),
            amount: Joi.number().min(0.01).required()
        })
    ).min(1).required(),
    split_among: Joi.array().items(
        Joi.object({
            user_id: Joi.string().hex().length(24).required(),
            amount: Joi.number().min(0).optional(),
            percentage: Joi.number().min(0).max(100).optional(),
            shares: Joi.number().integer().min(1).optional()
        })
    ).optional(),
    split_type: Joi.string().valid('equal', 'exact', 'percentage', 'shares').optional(),
    currency: Joi.string().optional()
});

export const editExpenseSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    amount: Joi.number().min(0.01).optional(),
    category: Joi.string().valid('food', 'travel', 'entertainment', 'utilities', 'shopping', 'health', 'other').optional(),
    paid_by: Joi.array().items(
        Joi.object({
            user_id: Joi.string().hex().length(24).required(),
            amount: Joi.number().min(0.01).required()
        })
    ).min(1).optional(),
    split_among: Joi.array().items(
        Joi.object({
            user_id: Joi.string().hex().length(24).required(),
            amount: Joi.number().min(0).optional(),
            percentage: Joi.number().min(0).max(100).optional(),
            shares: Joi.number().integer().min(1).optional()
        })
    ).optional(),
    split_type: Joi.string().valid('equal', 'exact', 'percentage', 'shares').optional(),
    currency: Joi.string().optional()
});
