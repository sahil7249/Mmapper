import { getIO } from '../utils/socket.js'
import { runPdfPipeline } from '../utils/runPdfPipeline.js'

export const uploadAndProcessPdf = (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No PDF file is uploaded" })
        }

        const pdfPath = req.file.path
        console.log("PDF File uploaded successfully")

        const io = getIO()

        runPdfPipeline({
            pdfPath:pdfPath,
            emit : (event,payload) => io.emit(event,payload)
        })

        res.json({
            success: true,
            message: "Process started"
        })

    } catch (error) {
        console.log("ERROR : while uploading file", error)
        res.json({
            success: false,
            message: "Error occured while pdf uploading"
        })
    }
}