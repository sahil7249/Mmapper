import { execFile } from 'child_process'
import util from 'util'
import callLama from '../utils/callLama.js'
import convertJsonToMarkmap from '../utils/convertJsonToMarkmap.js'
import { Map } from '../database/map.model.js'
import fs from 'fs'

const execPromise = util.promisify(execFile)

export const runPdfPipeline = async ({pdfPath,emit}) => {

    try {
        console.log("<---------Backend Process started--------->")
        console.log('Processing PDF:', pdfPath)
        
        console.log("Extracting text from pdf....")
        emit('pipeline:update',{step:0,message:'Extracting text'})
        
        const { stdout: extractedText, stderr } = await execPromise('python', ['./utils/extract_text.py', pdfPath])
    
        if (stderr) {
            console.log('Error while extracting text from PDF :', stderr)
        }
    
        if (!extractedText || extractedText.trim().length === 0) {
            console.log("No text extracted from pdf")
        }
    
        console.log("Calling LLM.....")
        emit('pipeline:update',{step:1,message:"calling LLM"})
        const llmResponse = await callLama(extractedText)
    
        console.log("Extracting json from llm response.....")
        let jsonContent = llmResponse?.choices[0].message.content
    
        console.log("Converting json into markmap format....")
        emit('pipeline:update',{step:2,message:"Converting text into markdown"})
        const {markmap,title} = convertJsonToMarkmap(JSON.parse(jsonContent))
    
        console.log("Converting markmap into mindmap")
        const map = await Map.create({
            title,
            markdown_content:markmap
        })

        if(!map) {
            console.log('Something went wrong while creating map:')
        }
        
        emit('pipeline:complete',{succes:true,id:map._id})
    
        await fs.promises.unlink(pdfPath).catch(() => { })
        
        console.log('PDF deleted')
        console.log("<---------Backend Process Ended--------->")
    } catch (error) {
        console.log("Error while processing: ",error.message)
        await fs.promises.unlink(pdfPath).catch(() => { })
    }
}
