import { User } from "../database/user.mode.js"
import { ApiError } from "../utils/ApiError.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

export const loginUser = async(username,password) => {
    const user = await User.findOne({ username })

    if(!user) {
        throw new ApiError(`User does not exists with username : ${username}`,404)
    }

    const isPasswordMatches = await user.isPasswordCorrect(password)

    if(!isPasswordMatches) {
        throw new ApiError("Invalid password",401)
    }
    
    const token = await jwt.sign(
        {
            id : user.id
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: "7d"
        }
    )

    const data = {
        user : sanitizeUser(user),
        token
    }

    return data
}

export const updateUserPassword = async (id,oldPassword,newPassword) => {
    const user = await User.findById(id)
    if(!user) {
        throw new ApiError("User does not exists",404)
    }
    
    if(!await user.isPasswordCorrect(oldPassword)) {
        throw new ApiError("Old password does not matches",401)
    }

    const hashedPassword = await bcrypt.hash(newPassword,Number(process.env.SALT_ROUNDS))

    const updatedUser = await user.updateOne({
        password : hashedPassword
    })

    return sanitizeUser(updatedUser)
}