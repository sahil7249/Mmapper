import { Router } from 'express'
import { uploadAndProcessPdf } from '../controller/process.controller.js' 
import multer from 'multer'
import { getAllMapData, saveMindMapToDB,getMapById,updateMapById, deleteMapById } from '../controller/map.controller.js'
import { getResponseFromBot } from '../controller/chatBot.controller.js'
import { validateRequest } from '../midddleware/validate.js'
import { createMapSchema, updateMapSchema } from '../validators/map.validator.js'
import { botRequestSchema } from '../validators/chatbot.validator.js'

const upload = multer({
    dest: 'uploads/'
})


const processRouter = Router()

processRouter.post('/upload-pdf',upload.single('pdf'),uploadAndProcessPdf)
processRouter.post('/',validateRequest(createMapSchema), saveMindMapToDB)
processRouter.post('/bot/:id',validateRequest(botRequestSchema),getResponseFromBot)
processRouter.get('/',getAllMapData)
processRouter.get('/:id',getMapById)
processRouter.put('/:id',validateRequest(updateMapSchema),updateMapById)
processRouter.delete('/:id',deleteMapById)
export default processRouter