import { execFile } from 'child_process'
import util from 'util'
import fs from 'fs'
import callLama from '../utils/callLama.js'
import convertJsonToMarkmap from '../utils/convertJsonToMarkmap.js'

const execPromise = util.promisify(execFile)
let pdfPath;

const uploadPdf = (req,res) => {
    try {
        if(!req.file) {
            res.status(400).json({ message:"No PDF file is uploaded"})
        }

        pdfPath = req.file.path
        console.log("PDF File uploaded successfully")
        res.json({
            success:true,
            message:"File uploaded successfully"
        })

    } catch (error) {
        console.log("ERROR : while uploading file",error)
        res.json({
            success:false,
            message: "Error occured while pdf uploading"
        })
    }
}

const processPdf = async (req,res) => {
    res.setHeader('Content-Type','text/event-stream')
    res.setHeader('Cache-Control','no-cache')
    res.setHeader('Connection','keep-alive')
    res.flushHeaders()

    req.on('close',() => {
        console.log('Client Disconnected')
    })


    let responseData = {
        stepNumber:0,
        isEnd:false,
        markmap:""
    }

    try {
        console.log("<---------Backend Process started--------->")
        
        console.log('01: Processing pdf: ',pdfPath)
        
        console.log("02: Extracting text from pdf")
        res.write(`data: ${JSON.stringify(responseData)}\n\n`)
        
        const { stdout:extractedText ,stderr } = await execPromise('python3',['./utils/extract_text.py',pdfPath])
        
        if(stderr) {
            console.log("Error while extracting text from pdf: ",stderr)
        }
        
        if(!extractedText || extractedText.trim().length == 0){
            console.log("No text extracted from pdf")
        }
        
        console.log("03: Calling LLM")
        responseData.stepNumber++
        res.write(`data: ${JSON.stringify(responseData)}\n\n`)
        
        const llmResponse = await callLama(extractedText)
        const jsonContent = llmResponse?.choices[0].message.content
        
        console.log("04: Converting json into markdown format")
        responseData.stepNumber++
        res.write(`data: ${JSON.stringify(responseData)}\n\n`)
        
        const markMapResponse = convertJsonToMarkmap(JSON.parse(jsonContent))
        
        console.log("Converting markdown into markmap")
        responseData.stepNumber++
        responseData.isEnd = true
        responseData.markmap = markMapResponse
        res.write(`data: ${JSON.stringify(responseData)}\n\n`)

    } catch (error) {
        console.log('Error: ',error)
        res.write(`data: ${JSON.stringify({
            stepNumber:responseData.stepNumber,
            isEnd:true,
            error:error.message
        })}`)
        res.end()
    } finally {
        if(pdfPath) {
            await fs.promises.unlink(pdfPath).catch((err) => {
                console.log("Error :",err)
            })
            console.log("PDF is deleted from local storage")
        }
        console.log("<---------Backend Process Ended--------->")
    }
}

export {processPdf,uploadPdf}
