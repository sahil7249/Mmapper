import joi from 'joi'

export const registerUserSchema = joi.object({
    body : joi.object({
        username : joi.string().required(),
        email: joi.string().required().email(),
        password: joi.string().required()
    })
})
