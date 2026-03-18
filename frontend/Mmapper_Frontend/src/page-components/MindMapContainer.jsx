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



export const MindMapContainer = () => {
    const [markdownContent, setMarkdownContent] = useState({})
    const [instanceData, setInstanceData] = useState(null)
    const { id } = useParams()

    const { data, error, loading } =  useMap(getMapById,id)
    if (error) {
        toast.error(error)
    }

    useEffect(() => {
        if(data) {
            setMarkdownContent(data)
        }
    },[data])

    const getData = (value) => {
        setInstanceData(value)
        return
    }


    return (
        <div className="w-screen px-10 mt-5 flex gap-0.5 items-center">
            <SpinnerModal isOpen={loading}/>
            <div className="w-3/4">
                <div className="flex justify-between">
                    <div>
                        <HomeBtn >
                            <House />
                        </HomeBtn>
                    </div>
                    <div className="flex gap-2.5 mb-2.5">
                        <MapButton name={"Fit"} handleClick={() => handleFit(instanceData)}>
                            <Search />
                        </MapButton>
                        <MapButton name={"Download"} handleClick={() => handleDownload(instanceData, markdownContent.title)}>
                            <Download />
                        </MapButton>
                    </div>
                </div>
                <div className="border h-180 rounded-2xl">
                    <MindMap markdown={markdownContent.markdown_content} handleData={getData} />
                </div>
            </div>
            <div className="w-1/4 h-180 border rounded-2xl mt-13 flex flex-col">

                <div className="flex-1 overflow-y-auto p-3 space-y-3">

                    <div className="bg-gray-200 p-3 rounded-xl max-w-[80%]">
                        Hello! How can I help you?
                    </div>

                    <div className="bg-blue-500 text-white p-3 rounded-xl max-w-[80%] ml-auto">
                        Give me map details
                    </div>

                </div>

                <div className="border-t p-3 flex items-center gap-2">
                    <textarea
                        className="flex-1 border rounded-xl p-2 resize-none focus:outline-none"
                        rows={1}
                        placeholder="Type a message..."
                    />

                    <button className="bg-blue-500 text-white p-2 rounded-full">
                        <MoveUp />
                    </button>
                </div>

            </div>
        </div>
    )
}