import joi from 'joi'

export const registerUserSchema = joi.object({
    body : joi.object({
        username : joi.string().required(),
        email: joi.string().required().email(),
        password: joi.string().required()
    })
})

export const loginUserSchema = joi.object({
    body : joi.object({
        username: joi.string().required(),
        password: joi.string().required()
    })
})

export const updatePasswordSchema = joi.object({
    body:  joi.object({
        oldPassword : joi.string().required(),
        newPassword: joi.string().required()
    })
})