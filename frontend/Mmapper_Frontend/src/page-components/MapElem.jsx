import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import DeleteModal from "../components/ui/DeleteModal"
import mapLogo from '../assets/mindmap.png'
import { CirclePlus, Trash } from "lucide-react"
import { UIStateContext } from "../App"

export const MapElem = ({ title, id }) => {
    const { setMapData } = useContext(UIStateContext)
    const [open, setOpen] = useState(false)

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/mindmap/${id}`)
    }

    return (
        <>
            <div className="flex items-center justify-between border rounded-xl w-180 p-3.5 m-2.5" >
                <div className="flex items-center gap-1 cursor-pointer" onClick={handleClick}>
                    <img src={mapLogo} alt="mind map logo" width={30} />
                    {title}
                </div>
                <div className="flex items-center gap-0.5 cursor-pointer">
                    <CirclePlus onClick={() => navigate(`/update/${id}`)} />
                    <Trash onClick={() => setOpen(true)} />
                </div>
            </div>
            <DeleteModal open={open} setOpen={setOpen} id={id} onDeleteSuccess={(id) => {
                setMapData(prev => {
                    prev.filter(item => item._id !== id)
                })
            }}/>
        </>
    )
}