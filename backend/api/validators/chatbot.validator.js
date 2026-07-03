import joi from 'joi'

export const botRequestSchema = joi.object({
    body : joi.object({
        context : joi.string().required(),
        question : joi.string().required()
    })
})