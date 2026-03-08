import { MapButton, HomeBtn, CustomBtn } from "../components/Buttons"
import { Download, SaveIcon, Search, File, Cable, House, Trash } from "lucide-react"
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { MindMap } from "./MindMap"
import { toast } from "react-toastify";
import { api } from "../api/axios";


export const CreateMap = () => {
    const [metaData, setMetaData] = useState({
        title: "Enter title here",
        colorFreezeLevel: 2
    })
    const [content, setContent] = useState("")
    const code = `---
title: ${metaData.title}
markmap:
colorFreezeLevel: 2
---

${content}

`
    const [mode, setMode] = useState('file')
    const [instanceData, setInstanceData] = useState(null)


    const getData = (data) => {
        setInstanceData(data)
    }


    const handleSave = async () => {
        try {
            const { data } = await api.post('/save-map', {
                title: metaData.title,
                markdown_content: code
            })

            if(!data) {
                toast.error("Something went wrong")
            }
            toast.success("Map saved successfully")
        } catch (error) {
            toast.error(error.message)
            throw new Error(error.message)
        }
    }


    return (
        <div className="w-screen px-10 mt-5">
            <div className="flex justify-between mb-2.5">
                <div className="flex items-center gap-5">
                    <div className="flex gap-2.5 border p-1.5 rounded-xl">
                        <CustomBtn name={"file"} handleClick={() => setMode('file')} >
                            <File />
                        </CustomBtn>
                        <CustomBtn name={"manual"} handleClick={() => setMode('manual')}  >
                            <Cable />
                        </CustomBtn>
                    </div>
                    <div className="border rounded-xl p-2 text-xl">
                        <input
                            type="text"
                            value={metaData.title}
                            style={{ outline: 'none' }}
                            onChange={(e) =>
                                setMetaData(prev => ({
                                    ...prev,
                                    title: e.target.value
                                }))

                            }
                        />
                    </div>
                </div>
                <div className="flex gap-2.5 ">
                    <HomeBtn >
                        <House />
                    </HomeBtn>
                    <MapButton name={"Fit"} >
                        <Search />
                    </MapButton>
                    <MapButton name={"Download"} >
                        <Download />
                    </MapButton>
                    <MapButton name={"Save"} handleClick={handleSave}>
                        <SaveIcon />
                    </MapButton>
                    <CustomBtn name={"clear"} handleClick={() => setContent("")}>
                        <Trash />
                    </CustomBtn>
                </div>
            </div>
            <div className="border h-190 rounded-2xl p-1.5 flex gap-0.5">
                {mode === 'file' ? (
                    <>
                        <div className="border w-1/2 h-full rounded-xl overflow-hidden">
                            <CodeMirror
                                className="h-full w-full rounded-xl"
                                value={content}
                                onChange={(value) => setContent(value)}
                            />
                        </div>
                        <div className="border w-2/3 h-full rounded-xl">
                            <MindMap markdown={code} handleData={getData} />
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