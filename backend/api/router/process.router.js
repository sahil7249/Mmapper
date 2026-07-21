import { Router } from 'express'
import multer from 'multer'
import * as schema from  '../validators/map.validator.js'
import * as mapController from '../controller/map.controller.js'
import { validateRequest } from '../midddleware/validate.js'
import { authenticate } from '../midddleware/auth.middleware.js'
import { botRequestSchema } from '../validators/chatbot.validator.js'
import { uploadAndProcessPdf } from '../controller/process.controller.js'
import { getResponseFromBot } from '../controller/chatBot.controller.js'

const upload = multer({
    dest: 'uploads/'
})


const processRouter = Router()
processRouter.use(authenticate)

processRouter.post('/upload-pdf',upload.single('pdf'),uploadAndProcessPdf)
processRouter.post('/',validateRequest(schema.createMapSchema), mapController.saveMindMapToDB)
processRouter.post('/bot/:id',validateRequest(botRequestSchema),getResponseFromBot)
processRouter.get('/',mapController.getAllMapByUserId)
processRouter.get('/',mapController.getAllMapData)
processRouter.get('/:id',mapController.getMapById)
processRouter.put('/:id',validateRequest(schema.updateMapSchema),mapController.updateMapById)
processRouter.delete('/:id',mapController.deleteMapById)
export default processRouter