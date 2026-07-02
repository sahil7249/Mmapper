import { getIO } from '../utils/socket.js'
import { runPdfPipeline } from '../utils/runPdfPipeline.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadAndProcessPdfService } from '../services/uploadAndProcessPdf.service.js'

export const uploadAndProcessPdf = (req, res) => {
    try {
        const message = uploadAndProcessPdfService(req.file)

        res.json({
            success: true,
            message: message
        })

    } catch (error) {
        console.log("ERROR : while uploading file", error)
        throw new ApiError(error.message)
    }
}