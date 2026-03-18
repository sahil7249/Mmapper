import { MapButton, HomeBtn } from "../components/Buttons"
import { Download, Search, House } from "lucide-react"
import { MindMap } from "./MindMap"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMap } from "../hooks/useMap";
import { getMapById } from "../services/mapService";
import SpinnerModal from "../components/ui/SpinnerModal";
import { handleDownload,handleFit } from "../utils/mapUtils";



export const MindMapContainer =  () => {
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
        <div className="w-screen px-10 mt-5">
            <SpinnerModal isOpen={loading}/>

            <div className="flex justify-between ">
                <div>
                    <HomeBtn >
                        <House />
                    </HomeBtn>
                </div>
                <div className="flex gap-2.5 mb-2.5">
                    <MapButton name={"Fit"} handleClick={() => handleFit(instanceData)}>
                        <Search />
                    </MapButton>
                    <MapButton name={"Download"} handleClick={() => handleDownload(instanceData,markdownContent.title)}>
                        <Download />
                    </MapButton>
                </div>
            </div>
            <div className="border h-180 rounded-2xl">
                <MindMap markdown={markdownContent.markdown_content} handleData={getData} />
            </div>
        </div>
    )
}