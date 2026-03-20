import { useState, useEffect, useRef } from "react"
import { ProgressModal } from "../components/ProgressModal"
import { useNavigate } from "react-router-dom"
import { io } from 'socket.io-client'
import { toast } from "react-toastify"
import { api } from "../api/axios"

export const Main = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const navigate = useNavigate()

    const socketRef = useRef(null)

    useEffect(() => {
        socketRef.current = io('http://localhost:8080')

        socketRef.current.on('pipeline:update', (data) => {
            setCurrentStep(data.step)
        })

        socketRef.current.on('pipeline:complete', (data) => {
            try {
                const id = data.id
                setIsModalOpen(false)
                navigate(`mindmap/${id}`)
                toast.success('Mind map created')
                console.log("Process Completed")

            } catch (error) {
                toast.error(error.message)
                console.log("Error : ", error.message)
            }
        })

        socketRef.current.on('connection_error', () => {
            setIsModalOpen(false)
            console.log(err.message);
            console.log(err.description);
            console.log(err.context);
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }

    }, [])

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]

        if (file.type !== 'application/pdf') {
            toast.error('Please upload a pdf file')
            return
        }

        setIsModalOpen(true)

        const formdata = new FormData()
        formdata.append('pdf', file)
        try {
            const { data } = await api.post('/upload-pdf', formdata)

            if (!data.success) {
                toast.error(data.message)
                throw new Error(data.message)
            }

        } catch (error) {
            setIsModalOpen(false)
            toast.error(error.message)
            throw new Error(error.message)   
        }
    }


    return (
        <div className="mt-10">
            <div className="w-screen text-center">
                <span className="border p-5 rounded-xl text-2xl">Convert PDF to Mind Map or create one</span>
            </div>
            <div className="flex justify-center gap-10 mt-12 ">
                <div className="border h-96 w-96 rounded-xl p-9">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 border flex items-center rounded-full justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload" aria-hidden="true"><path d="M12 3v12"></path><path d="m17 8-5-5-5 5"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path></svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Upload PDF</h2>
                        <p className="text-gray-400 mb-6">Convert your PDF document into an interactive mind map.</p>
                        <label className="cursor-pointer  text-black border px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload" aria-hidden="true"><path d="M12 3v12"></path><path d="m17 8-5-5-5 5"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            </svg>Choose PDF File<input accept=".pdf" className="hidden" type="file" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>
                <div className="border h-96 w-96 rounded-xl p-9">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20  border flex items-center justify-center rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Create Map Manually</h2>
                        <p className="text-gray-400 mb-6">Start with a blank mind map and build it yourself</p>
                        <button className=" text-black border px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2" onClick={() => navigate('/create')} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus" aria-hidden="true">
                                <path d="M5 12h14"></path><path d="M12 5v14"></path>
                            </svg>
                            Create New Mind Map
                        </button>
                    </div>
                </div>
                <ProgressModal isModalOpen={isModalOpen} currentStep={currentStep} />
            </div>
        </div>
    )
}