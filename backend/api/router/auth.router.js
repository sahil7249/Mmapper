import { Router } from 'express'
import * as schema from '../validators/auth.validators.js'
import { validateRequest } from '../midddleware/validate.js'
import * as authService from '../controller/auth.contoller.js'
import { authenticate } from '../midddleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/register',validateRequest(schema.registerUserSchema),authService.register)
authRouter.post('/login',validateRequest(schema.loginUserSchema),authService.login)
authRouter.patch('/change-password',authenticate,validateRequest(schema.updatePasswordSchema),authService.updatePassword)

export default authRouter