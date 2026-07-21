import { registerUser } from "../../services/auth.service.js"

export const register = async(req,res) => {
    const { username,email,password } = req?.body
    const user = await registerUser(username,email,password)

    return res.json({
        message : "User created successfully",
        data : user
    })
}