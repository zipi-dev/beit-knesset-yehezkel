import Joi from 'joi';

export const addShiurSchema = Joi.object({
    titleHebrew: Joi.string().trim().required(),
    titleEnglish: Joi.string().trim().allow(''),
    mediaUrl: Joi.string().trim().allow(''),
    date: Joi.date().required(),
    rabbi: Joi.string()
});

export const updateShiurSchema = Joi.object({
    titleHebrew: Joi.string().trim(),
    titleEnglish: Joi.string().trim().allow(''),
    mediaUrl: Joi.string().trim().allow(''),
    date: Joi.date(),
    rabbi: Joi.string()
}).min(1);