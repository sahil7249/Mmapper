import { FileText } from "lucide-react"
import { useMap } from "../hooks/useMap"
import SpinnerModal from "../components/ui/SpinnerModal"
import { getAllMaps } from "../services/mapService"
import { toast } from "react-toastify"
import { MapElem } from "./MapElem"

const NoMindMapFound = () => {
    return (
        <div className="text-center py-20 border rounded-xl mt-5">
            <FileText size={64} className="mx-auto mb-4 text-gray-600" />
            <p className="text-xl text-gray-400">No mind maps yet</p>
            <p className="text-gray-500 mt-2">Create your first mind map to get started</p>
        </div>
    )
}

export const MapList = () => {
    const { data, error, loading } = useMap(getAllMaps)

    if (error) {
        toast.error(error)
    }

    return (
        <>
            <SpinnerModal isOpen={loading} />
            <div className="mt-5 px-5">
                {data?.length > 0 ?
                    (
                        <>
                            <h1 className="ml-8 mt-5 text-2xl">
                                Map List
                            </h1>

                            {data.map(map => (
                                <MapElem title={map.title} key={map._id} id={map._id} />
                            ))}
                        </>
                    ) : (
                        <NoMindMapFound />
                    )}

            </div>
        </>
    )
}