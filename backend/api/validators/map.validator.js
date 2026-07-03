import joi from 'joi'

export const createMapSchema = joi.object({
    body : joi.object({
        title : joi.string().required(),
        markdown_content: joi.string().required()
    })
})

export const updateMapSchema = joi.object({
    body : joi.object({
        title : joi.string(),
        markdown_content : joi.string()
    })
})
