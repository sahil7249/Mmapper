import { ApiError } from "../utils/ApiError.js"
import { runPdfPipeline } from "../utils/runPdfPipeline.js"
import { getIO } from "../utils/socket.js"

export const uploadAndProcessPdfService = (file) =>{
    if(!file) {
        throw new ApiError("No pdf file is uploaded",400)
    }
    const path = file.path
    const io = getIO()

    runPdfPipeline({
        pdfPath : path,
        emit : (event,payload) => io.emit(event,payload)
    })

    return "Process started"
}