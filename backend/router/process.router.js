import { Router } from 'express'
import { uploadAndProcessPdf } from '../controller/process.controller.js' 
import multer from 'multer'
import { getAllMapData, saveMindMapToDB } from '../controller/map.controller.js'

const upload = multer({
    dest: 'uploads/'
})


const processRouter = Router()

processRouter.post('/upload-pdf',upload.single('pdf'),uploadAndProcessPdf)
processRouter.post('/save-map',saveMindMapToDB)
processRouter.get('/all-maps',getAllMapData)
export default processRouter