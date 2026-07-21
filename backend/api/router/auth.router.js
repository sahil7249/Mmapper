import { Router } from 'express'
import { login, register } from '../controller/auth.contoller.js'
import { validateRequest } from '../midddleware/validate.js'
import { loginUserSchema, registerUserSchema } from '../validators/auth.validators.js'

const authRouter = Router()

authRouter.post('/register',validateRequest(registerUserSchema),register)
authRouter.post('/login',validateRequest(loginUserSchema),login)

export default authRouter