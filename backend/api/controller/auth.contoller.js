import * as authService from "../../services/auth.service.js"

export const register = async(req,res) => {
    const { username,email,password } = req?.body
    const user = await authService.registerUser(username,email,password)

    return res.json({
        message : "User created successfully",
        data : user
    })
}

export const login = async(req,res) => {
    const { username,password } = req?.body
    const data = await authService.loginUser(username,password)

    return res.json({
        message : "User logged in successfully",
        data : data
    })

}

export const updatePassword = async (req,res) => {
  const id = req?.user.id
  const { oldPassword,newPassword } = req?.body

  const updatedUser = await authService.updateUserPassword(id,oldPassword,newPassword)

  return res.json({
    message : "Password updated successfully",
    data : updatedUser
  })
}