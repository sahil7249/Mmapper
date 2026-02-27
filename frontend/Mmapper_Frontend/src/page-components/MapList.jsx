import { FileText, CirclePlus, Trash } from "lucide-react"
import mapLogo from '../assets/mindmap.png'
import { UIStateContext } from "../App"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import DeleteModal from "../components/ui/DeleteModal"

const MapElem = ({ title, markdata, id }) => {
    const { setData,setMapData } = useContext(UIStateContext)
    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    const handleClick = () => {
        setData(markdata)
        navigate('/mindmap')
    }

    const handleUpdate = async () => {
        navigate(`/${id}`)
    }

    const handleDelete = async () => {
        setOpen(true)
    }

    return (
        <>
            <div className="flex items-center justify-between border rounded-xl w-180 p-3.5 m-2.5" >
                <div className="flex items-center gap-1 cursor-pointer" onClick={handleClick}>
                    <img src={mapLogo} alt="mind map logo" width={30} />
                    {title}
                </div>
                <div className="flex items-center gap-0.5 cursor-pointer">
                    <CirclePlus onClick={handleUpdate} />
                    <Trash onClick={handleDelete} />
                </div>
            </div>
            <DeleteModal open={open} setOpen={setOpen} id={id} onDeleteSuccess={(deletedId) => {
                setMapData(prev => {
                    prev.filter(item => item._id !== deletedId)
                })
            }}/>
        </>
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
        <>
            <h1 className="ml-8 mt-5 text-2xl">
                Map List
            </h1>
            <div className="mt-5 px-5">
                {maps?.length > 0 ? (
                    maps.map(map => (
                        <MapElem title={map.title} key={map.title} markdata={map.markdown_content} id={map._id} />
                    ))
                ) : (
                    <NoMindMapFound />
                )}
            </div>
        </>
    )
}