import { MapButton } from "../components/Buttons"
import { Download, SaveIcon, RotateCcw, Search } from "lucide-react"

export const MindMapContainer = ({mindmap}) => {
    return (
        <div className="w-screen px-10 mt-5">
            <div className="flex flex-row-reverse gap-5 mb-2 mr-2">
                <MapButton name={"Resize"} >
                    <RotateCcw />
                </MapButton>
                <MapButton name={"Fit"} >
                    <Search />  
                </MapButton>
                <MapButton name={"Download"} >
                    <Download />
                </MapButton>
                <MapButton name={"Save"} >
                    <SaveIcon />
                </MapButton>
            </div>
            <div className="border h-180 rounded-2xl">
                {mindmap}
            </div>
        </div>
    )
}