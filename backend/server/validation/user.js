import Joi from "joi";

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string()
        .equal(Joi.ref('password'))
        .required(),
    phoneno: Joi.string().required(),
})