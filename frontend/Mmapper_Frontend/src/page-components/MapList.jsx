import { FileText } from "lucide-react"
import mapLogo from '../assets/mindmap.png'

const MapElem = ({ title }) => {
    return (
        <div className="border p-4 w-96 mt-5 rounded-xl flex items-center gap-2">
            <img src={mapLogo} alt="mind map logo" width={30}/> {title}
        </div>
    )
}

const NoMindMapFound = () => {
    return (
        <div className="text-center py-20 border rounded-xl mt-5">
            <FileText size={64} className="mx-auto mb-4 text-gray-600" />
            <p className="text-xl text-gray-400">No mind maps yet</p>
            <p className="text-gray-500 mt-2">Create your first mind map to get started</p>
        </div>
    )
}

export const MapList = ({ maps }) => {

    return (
        <div className="mt-5 px-5">
            {maps?.length > 0 ? (
                maps.map(map => (
                    <MapElem title={map.title} key={map.title}/>
                ))
            ):(
                <NoMindMapFound />
            )}
        </div>
    )
}