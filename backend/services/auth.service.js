import { User } from "../database/user.mode.js"
import { ApiError } from "../utils/ApiError.js"
import bcrypt from 'bcrypt'

const sanitizeUser = (user) => {
    const { password,...sanitized } = user.toObject ? user.toObject() : user;
    return sanitized
}


export const registerUser = async (username,email,password) => {
    const isUserExists = await User.findOne({
        $or:[{email},{username}]
    })

    if(isUserExists) {
        throw new ApiError(`User with similar email: ${email} or username:${username} already exists`,400)
    }   

    const hashedPassword = await bcrypt.hash(password,Number(process.env.SALT_ROUNDS))

    const user = await User.create({
        username ,
        email,
        password:hashedPassword
    })

    return sanitizeUser(user)
}