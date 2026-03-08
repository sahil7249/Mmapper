import { MapButton, HomeBtn, CustomBtn } from "../components/Buttons"
import { Download, SaveIcon, Search, File, Cable, House, Trash } from "lucide-react"
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { MindMap } from "./MindMap"
import { toast } from "react-toastify";
import { useMap } from "../hooks/useMap";
import { getMapById } from "../services/mapService";
import SpinnerModal from "../components/ui/SpinnerModal";
import { api } from "../api/axios";
import { handleDownload, handleFit, handleMouseDown } from "../utils/mapUtils";

export const UpdateMap = () => {
    const { id } = useParams()
    const [leftWidth, setLeftWidth] = useState(30)
    const containerRef = useRef(null)
    const [mode, setMode] = useState('file')
    const [instanceData, setInstanceData] = useState(null)


    const { data, error, loading } = useMap(getMapById, id)

    const [content, setContent] = useState("")

    const code = `---
title: "markmap"
markmap:
colorFreezeLevel: 2
---
${content}
`
    if (error) {
        toast.error(error)
    }

    useEffect(() => {
        if (data) {
            setContent(data)
        }
    }, [data])

    const handleUpdate = async (id, updateData) => {
        try {

            const { data } = await api.put(`/${id}/update`,{
                updateData:updateData
            })
            console.log(data)
            if (!data) {
                toast.error('Something went wrong')
            }
            toast.success("Map updated successfully")
        } catch (error) {
            throw new Error(error.message)
        }
    }


    const getData = (data) => {
        setInstanceData(data)
    }


    return (
        <div className="w-screen px-10 mt-5">
            <SpinnerModal isOpen={loading} />
            <div className="flex justify-between mb-2.5">
                <div className="flex gap-2.5 border p-1.5 rounded-xl">
                    <CustomBtn name={"file"} handleClick={() => setMode('file')} >
                        <File />
                    </CustomBtn>
                    <CustomBtn name={"manual"} handleClick={() => setMode('manual')}  >
                        <Cable />
                    </CustomBtn>
                </div>
                <div className="flex gap-2.5 ">
                    <HomeBtn >
                        <House />
                    </HomeBtn>
                    <MapButton name={"Fit"} handleClick={() => handleFit(instanceData)}>
                        <Search />
                    </MapButton>
                    <MapButton name={"Download"} handleClick={() => handleDownload(instanceData,content.title)} >
                        <Download />
                    </MapButton>
                    <MapButton name={"Save"} handleClick={() => handleUpdate(id, code)}>
                        <SaveIcon />
                    </MapButton>
                    <CustomBtn name={"clear"} handleClick={() => setContent("")}>
                        <Trash />
                    </CustomBtn>
                </div>
            </div>
            <div ref={containerRef} className="border h-190 rounded-2xl p-1.5 flex gap-0.5">
                {mode === 'file' ? (
                    <>
                        <div style={{ width: `${leftWidth}%` }} className="border  h-full rounded-xl overflow-scroll">
                            <CodeMirror
                                className="h-full w-full rounded-xl"
                                value={content.markdown_content}
                                onChange={(value) => setContent(value)}
                            />
                        </div>
                        <div
                            onMouseDown={(e) => handleMouseDown(e,containerRef,leftWidth,setLeftWidth)}
                            className="w-2 cursor-col-resize bg-gray-300 hover:bg-gray-400"
                        />

                        <div className="border h-full rounded-xl" style={{ width: `${100 - leftWidth}%` }}>
                            <MindMap markdown={content.markdown_content} handleData={getData} />
                        </div>

                    </>
                ) : (
                    <div className="border w-full h-full rounded-xl ">
                        Still in work...
                    </div>
                )}

            </div>
        </div>
    )
}