import { Router } from 'express'
import { register } from '../controller/auth.contoller.js'
import { validateRequest } from '../midddleware/validate.js'
import { registerUserSchema } from '../validators/auth.validators.js'

const authRouter = Router()

authRouter.post('/register',validateRequest(registerUserSchema),register)

export default authRouter