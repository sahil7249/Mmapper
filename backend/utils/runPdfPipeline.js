import { execFile } from 'child_process'
import util from 'util'
import convertJsonToMarkmap from '../utils/convertJsonToMarkmap.js'
import { Map } from '../database/map.model.js'
import fs from 'fs'
import callGemini from '../utils/callLama.js'
import { ApiError } from './ApiError.js'

const execPromise = util.promisify(execFile)

export const runPdfPipeline = async ({pdfPath,emit}) => {

    try {
        console.log("<---------Backend Process started--------->")
        console.log('Processing PDF:', pdfPath)
        
        console.log("Extracting text from pdf....")
        emit('pipeline:update',{step:0,message:'Extracting text'})
        
        const { stdout: extractedText, stderr } = await execPromise('python', ['./utils/extract_text.py', pdfPath])
    
        if (stderr) {
            throw new ApiError("Error while extracting text from PDF :',")
        }
    
        if (!extractedText || extractedText.trim().length === 0) {
            throw new ApiError("No text extracted from pdf")
        }
    
        console.log("Calling LLM.....")
        emit('pipeline:update',{step:1,message:"calling LLM"})
        const llmResponse = await callGemini(extractedText)
    
        const {markmap,title} = convertJsonToMarkmap(llmResponse)
    
        console.log("Converting markmap into mindmap")
        const map = await Map.create({
            title,
            markdown_content:markmap
        })

        if(!map) {
            throw new ApiError("Map creation failed")
        }
        
        emit('pipeline:complete',{succes:true,id:map._id})
    
        await fs.promises.unlink(pdfPath).catch(() => { })
        
        console.log('PDF deleted')
        console.log("<---------Backend Process Ended--------->")
    } catch (error) {
        console.log("Error while processing: ",error.message)
        await fs.promises.unlink(pdfPath).catch(() => { })
        throw new ApiError(error.message)
    }
}
