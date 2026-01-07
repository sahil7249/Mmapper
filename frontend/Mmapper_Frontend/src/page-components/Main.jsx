import { UIStateContext } from "../App"
import { useContext, useState } from "react"
import { ProgressModal } from "../components/ProgressModal"
import { useNavigate } from "react-router-dom"

export const Main = () => {

    const { setData } = useContext(UIStateContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const navigate = useNavigate()


    const handleFileUpload = async (e) => {
        const file = e.target.files[0]

        if (file.type !== 'application/pdf') {
            alert('Please upload a pdf file')
            return
        }

        setIsModalOpen(true)

        const formdata = new FormData()
        formdata.append('pdf', file)


        let source
        let completed = false
        try {
            const uploadRes = await fetch('http://localhost:8080/api/upload-pdf', {
                method: 'POST',
                body: formdata
            })

            if (!uploadRes.ok) {
                throw new Error('Upload Failed')
            }

            const uploadData = await uploadRes.json()

            if (!uploadData.success) {
                throw new Error(uploadData.message)
            }

            source = new EventSource('http://localhost:8080/api/process-pdf')

            source.onmessage = (event) => {
                const responseData = JSON.parse(event.data)

                setCurrentStep(responseData.stepNumber)

                if (responseData.isEnd) {

                    const mindmapContent = {
                        title: responseData.title,
                        markdown_content: responseData.markmap
                    }

                    completed = true
                    setData(responseData.markmap)
                    navigate('mindmap')
                    localStorage.setItem('mindmap', JSON.stringify([mindmapContent]))
                    console.log("End of backend response")
                }
            }

            source.onerror = () => {
                if (completed) {
                    console.log("SSE closed naturally")
                }
                console.log("SSE Connection error")
                setIsModalOpen(false)
                source.close()
                alert('SSE Error occured Failed to process pdf')
            }

        } catch (error) {
            console.log('Error while uploading a file: ', error)
            setIsModalOpen(false)
            alert("Failed to upload file")
            if (source) source.close()
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
                        <button className=" text-black border px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
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