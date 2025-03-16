import Joi from "joi";

export const registerValidator =  Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required
});

export const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const expenseValidator = Joi.object({
    item: Joi.string().required(),
    amount: Joi.number().positive().required(),
    category: Joi.string().required(),
    payment: Joi.string().required(),
    status: Joi.string().valid("Pending", "Completed").required()
});