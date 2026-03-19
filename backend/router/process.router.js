import { Router } from 'express'
import { uploadAndProcessPdf } from '../controller/process.controller.js' 
import multer from 'multer'
import { getAllMapData, saveMindMapToDB,getMapById,updateMapById, deleteMapById } from '../controller/map.controller.js'
import { getResponseFromBot } from '../controller/chatBot.controller.js'

const upload = multer({
    dest: 'uploads/'
})


const processRouter = Router()

processRouter.post('/upload-pdf',upload.single('pdf'),uploadAndProcessPdf)
processRouter.post('/save-map',saveMindMapToDB)
processRouter.post('/bot/:id',getResponseFromBot)
processRouter.get('/all-maps',getAllMapData)
processRouter.get('/:id',getMapById)
processRouter.put('/:id/update',updateMapById)
processRouter.delete('/:id/delete',deleteMapById)
export default processRouter