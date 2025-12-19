import { exec } from 'child_process'
import util from 'util'
import fs from 'fs'
import callLama from '../utils/callLama.js'
import convertJsonToMarkmap from '../utils/convertJsonToMarkmap.js'

const execPromise = util.promisify(exec)

const processPdf = async (req, res) => {
    let pdfPath = null

    try {
        if (!req.file) {
            return res.status(400).json({ error: "No PDF file uploaded" })
        }

        pdfPath = req.file.path
        console.log('Processing PDF:', pdfPath)

        console.log("Extracting text from pdf....")
        const { stdout: extractedText, stderr } = await execPromise(`python3 ./utils/extract_text.py "${pdfPath}"`)

        if (stderr) {
            console.log('Error while extracting text from PDF :', stderr)
        }

        if (!extractedText || extractedText.trim().length === 0) {
            console.log("No text extracted from pdf")
        }

        console.log("Calling LLM.....")
        const llmResponse = await callLama(extractedText)

        console.log("Extracting json from llm response.....")
        let jsonContent = llmResponse?.choices[0].message.content

        console.log("Converting json into markmap format....")
        jsonContent = JSON.parse(jsonContent)

        const markMapResponse = convertJsonToMarkmap(jsonContent)

        await fs.unlink(pdfPath,(err => {
            if (err) console.log(err);
            else {
                console.log("\nDeleted file");
            }
        }))

        res.json({
            success: true,
            markdown: markMapResponse
        })

    } catch (error) {
        console.log('Error: ', error)

        if (pdfPath) {
            try {
                fs.unlink(pdfPath,(err) => {
                    if(err) {
                        console.log("Error while unlinking the file:",err)
                    }
                    console.log(`${pdfPath} is deleted`)
                })
            } catch (e) {
                console.log("Error while unlinking the PDF: ", e.message)
            }
        }

        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


export default processPdf
