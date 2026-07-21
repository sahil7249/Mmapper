import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const { Schema } = mongoose

const userSchema = new Schema({
    username : {
        type : String,
        required: true,
        lowercase :true,
        unique : true,
        trim : true
    },
    email: {
        type : String,
        required : true,
        lowercase:true,
        unique :true,
        trim : true
    },
    password: {
        type : String
    }
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}

export const User = mongoose.model('User',userSchema)