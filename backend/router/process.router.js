import { Router } from 'express'
import {processPdf,uploadPdf} from '../controller/process.controller.js'
import multer from 'multer'

const upload = multer({
    dest: 'uploads/'
})


const processRouter = Router()

processRouter.post('/upload-pdf',upload.single('pdf'),uploadPdf)
processRouter.get('/process-pdf',processPdf)

export default processRouter