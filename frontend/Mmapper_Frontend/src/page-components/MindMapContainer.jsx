import { MapButton, HomeBtn } from "../components/Buttons"
import { Download, Search, House, MoveUp, Move } from "lucide-react"
import { MindMap } from "./MindMap"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMap } from "../hooks/useMap";
import { getMapById } from "../services/mapService";
import SpinnerModal from "../components/ui/SpinnerModal";
import { handleDownload, handleFit } from "../utils/mapUtils";
import { ReactTyped } from 'react-typed'
import { api } from "../api/axios";



export const MindMapContainer = () => {
    const [markdownContent, setMarkdownContent] = useState({
        title: "",
        markdown_content: ""
    })
    const [instanceData, setInstanceData] = useState(null)
    const [streamingText,setStreamingText] = useState()
    const [question, setQuestion] = useState("")
    const { id } = useParams()
    const [message, setMessage] = useState(() => {
        try {
            const saved = localStorage.getItem(`${id}`)
            return saved  ? JSON.parse(saved) : []
        } catch (error) {
            return []
        }
    })
    const { data, error, loading } = useMap(getMapById, id)
    if (error) {
        toast.error(error)
    }

    useEffect(() => {
        if (data) {
            setMarkdownContent(data)
        }
    }, [data])

    const getData = (value) => {
        setInstanceData(value)
        return
    }

    const handleChange = (e) => {
        setQuestion(e.target.value)
    }


    const handleClick = async () => {
        try {
            const { data } = await api.post('/bot/:id', {
                context: markdownContent.markdown_content,
                question: question
            })
            if (!data) {
                console.log("Error while fetching response from chatbot")
            }

            const userQuestion = question
            setQuestion("")
            setMessage(prev => [...prev, { type: 'question', text: userQuestion }])

            await new Promise(res => setTimeout(res, 2000))

            let info = JSON.parse(data.data)
            let para = info['para'] + "<br> <br>"
            for (let point of info['points']) {
                para += ' - ' + point + "<br>"
            }
            setStreamingText(para)
            setTimeout(() => {
                setMessage(prev => [...prev, { type: 'response', text: para }])
                setStreamingText(null)
            },15000)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if(id){
            localStorage.setItem(`${id}`,JSON.stringify(message))
        }

    }, [message,id])

    return (
        <div className="w-screen h-screen px-6 py-4 mt-5 flex gap-1 items-center overflow-hidden">
            <SpinnerModal isOpen={loading} />
            <div className="w-3/4 flex flex-col h-full">
                <div className="flex justify-between mb-2">
                    <div>
                        <HomeBtn >
                            <House />
                        </HomeBtn>
                    </div>
                    <div className="flex gap-2.5 ">
                        <MapButton name={"Fit"} handleClick={() => handleFit(instanceData)}>
                            <Search />
                        </MapButton>
                        <MapButton name={"Download"} handleClick={() => handleDownload(instanceData, markdownContent.title)}>
                            <Download />
                        </MapButton>
                    </div>
                </div>
                <div className="border flex-1 rounded-2xl overflow-hidden">
                    <MindMap markdown={markdownContent.markdown_content} handleData={getData} />
                </div>
            </div>
            <div className="w-1/4 h-full border rounded-2xl flex flex-col">

                <div className="flex-1 overflow-y-auto p-3 space-y-3">

                    <div className="bg-gray-200 border-t p-3 rounded-xl flex gap-2">
                        Hello! How can I help you?
                    </div>
                    {message.map((msg, index) => (

                        <div 
                            key={index}
                            className={
                                msg.type === 'question'
                                ? "bg-blue-500 text-white p-3 rounded-xl max-w-[80%] ml-auto"
                                : "bg-gray-200 p-3 rounded-xl max-w-[80%]"
                            }
                        >
                            <div  
                                dangerouslySetInnerHTML={
                                    {__html:msg.text}
                                }
                            />
                        </div>
                    ))}
                    {streamingText && 
                        <div className="bg-gray-200 p-3 rounded-xl max-w-[80%]">
                            <ReactTyped 
                                strings={[streamingText]}
                                typeSpeed={20}
                                showCursor={false}
                            />
                        </div>
                    }


                </div>

                <div className="border-t p-3 flex items-center gap-2">
                    <textarea
                        value={question}
                        className="flex-1 border rounded-xl p-2 resize-none focus:outline-none"
                        rows={1}
                        placeholder="Type a message..."
                        onChange={handleChange}
                    > </textarea>

                    <button className={` text-white p-2 rounded-full  transition-all duration-200 ${question.trim()
                        ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        : "bg-gray-300 cursor-not-allowed"
                        }`} onClick={handleClick}>
                        <MoveUp />
                    </button>
                </div>

            </div>
        </div>
    )
}