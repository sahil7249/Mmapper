import { loginUser, registerUser, updateUserPassword } from "../../services/auth.service.js"

export const register = async(req,res) => {
    const { username,email,password } = req?.body
    const user = await registerUser(username,email,password)

    return res.json({
        message : "User created successfully",
        data : user
    })
}

export const login = async(req,res) => {
    const { username,password } = req?.body
    const data = await loginUser(username,password)

    return res.json({
        message : "User logged in successfully",
        data : data
    })

}

export const updatePassword = async (req,res) => {
  const id = req?.user.id
  const { oldPassword,newPassword } = req?.body

  const updatedUser = await updateUserPassword(id,oldPassword,newPassword)

  return res.json({
    message : "Password updated successfully",
    data : updatedUser
  })
}