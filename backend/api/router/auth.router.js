import { Router } from 'express'
import { login, register, updatePassword } from '../controller/auth.contoller.js'
import { validateRequest } from '../midddleware/validate.js'
import { loginUserSchema, registerUserSchema, updatePasswordSchema } from '../validators/auth.validators.js'
import { authenticate } from '../midddleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/register',validateRequest(registerUserSchema),register)
authRouter.post('/login',validateRequest(loginUserSchema),login)
authRouter.patch('/change-password',authenticate,validateRequest(updatePasswordSchema),updatePassword)

export default authRouter