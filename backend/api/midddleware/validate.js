import { ApiError } from "../../utils/ApiError.js"

export const validateRequest = (schema) => (req,res,next) => {
    const { error }= schema.validate(
        { body : req?.body },
        { abortEarly : false },
    )
    if(error) {
        const message = error.details.map((d) => d.message.replace("\\","")).join(", ")
        return next(new ApiError(message,400))
    }
    next()
}