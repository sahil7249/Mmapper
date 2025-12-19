import { Router } from 'express'
import processPdf from '../controller/process.controller'

const processRouter = Router()

processRouter.route('/process-pdf').post(processPdf)

export default processRouter