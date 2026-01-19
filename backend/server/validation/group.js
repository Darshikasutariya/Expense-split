import Joi from "joi";

export const createGroupSchema = Joi.object({
    groupName: Joi.string().required(),
    groupDescription: Joi.string().allow('').optional(),
    groupPicture: Joi.string().allow('').optional(),
    groupType: Joi.string().valid('trip', 'home', 'couple', 'friends', 'family', 'work', 'other').optional()
});

export const editGroupSchema = Joi.object({
    groupName: Joi.string().optional(),
    groupDescription: Joi.string().allow('').optional(),
    groupPicture: Joi.string().allow('').optional(),
    groupType: Joi.string().valid('trip', 'home', 'couple', 'friends', 'family', 'work', 'other').optional(),
    splitType: Joi.string().valid('equal', 'exact', 'percentage', 'shares').optional()
});

export const addMemberSchema = Joi.object({
    user_id: Joi.string().hex().length(24).optional(),
    user_ids: Joi.array().items(Joi.string().hex().length(24)).optional()
}).or('user_id', 'user_ids');

export const removeMemberSchema = Joi.object({
    user_id: Joi.string().hex().length(24).optional(),
    user_ids: Joi.array().items(Joi.string().hex().length(24)).optional()
}).or('user_id', 'user_ids');
