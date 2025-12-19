import { Router } from 'express'
import processPdf from '../controller/process.controller.js'
import multer from 'multer'

const upload = multer({
    dest: 'uploads/'
})


const processRouter = Router()

processRouter.post('/process-pdf',upload.single('pdf'),processPdf)

export default processRouter