import { MapButton, HomeBtn, CustomBtn } from "../components/Buttons"
import { Download, SaveIcon, Search, File, Cable, House, Trash } from "lucide-react"
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { MindMap } from "./MindMap"


const fetchData = async (id) => {
    try {
        const dbResponse = await fetch(`http://localhost:8080/api/map/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!dbResponse.ok) {
            console.log(dbResponse.message)
        }
        const mapData = await dbResponse.json()
        console.log("Map data fetched successfully")
        return mapData
    } catch (error) {
        console.log("Error while fetching map data: ", error)
    }
}


export const UpdateMap = () => {
    const { id } = useParams()
    const [leftWidth, setLeftWidth] = useState(30)
    const containerRef = useRef(null)
    const [mode, setMode] = useState('file')
    const [instanceData,setInstanceData] = useState(null)

    const [metaData,setMetaData] = useState({
        title:"markmap",
        colorFreezeLevel: 2
    })
    const [content,setContent] = useState("")
    
    const code = `---
title: ${metaData.title}
markmap:
colorFreezeLevel: 2
---
${content}
`



    useEffect(() => {
        const fetchMarkdown = async () => {
            const response = await fetchData(id)
            
            if (response) {
                setContent(response.data.markdown_content)
            }
        }
        fetchMarkdown()
    }, [id])

    const handleSave = async (id,code) => {
        try {
            const dbResponse = await fetch(`http://localhost:8080/api/map/${id}/update`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    updateData: code
                })               
            })

            if (!dbResponse.ok) {
                console.log("Request failed: ",dbResponse.status)
            }
            const result = await dbResponse.json()
            console.log(result.message)
            alert('map updated successfully')

        } catch (error) {
            console.log('Error: ', error.message)
        }
    }


    
    const getData = (data) => {
        setInstanceData(data)
    }


    const handleManualMode = () => {
        setMode('manual')
    }

    const handleFileMode = () => {
        setMode('file')
    }

    const handleClear = () => {
        setContent("")
    }

    const handleMouseDown = (e) => {
        e.preventDefault();

        const startX = e.clientX;
        const containerWidth = containerRef.current.offsetWidth;
        const startWidth = leftWidth;

        const handleMouseMove = (moveEvent) => {
            const delta = moveEvent.clientX - startX;
            const newWidth = ((startWidth / 100) * containerWidth + delta) / containerWidth * 100;

            if (newWidth > 20 && newWidth < 80) {
                setLeftWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };


    return (
        <div className="w-screen px-10 mt-5">
            <div className="flex justify-between mb-2.5">
                <div className="flex gap-2.5 border p-1.5 rounded-xl">
                    <CustomBtn name={"file"} handleClick={handleFileMode} >
                        <File />
                    </CustomBtn>
                    <CustomBtn name={"manual"} handleClick={handleManualMode}  >
                        <Cable />
                    </CustomBtn>
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
                    <MapButton name={"Save"} handleClick={() => handleSave(id,code)}>
                        <SaveIcon />
                    </MapButton>
                    <CustomBtn name={"clear"} handleClick={handleClear}>
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
                                value={content}
                                onChange={(value) => setContent(value)}
                            />
                        </div>
                        <div
                            onMouseDown={handleMouseDown}
                            className="w-2 cursor-col-resize bg-gray-300 hover:bg-gray-400"
                        />

                        <div className="border h-full rounded-xl" style={{ width: `${100 - leftWidth}%` }}>
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