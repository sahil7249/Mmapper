import { MapButton, HomeBtn } from "../components/Buttons"
import { Download, SaveIcon, Search, House } from "lucide-react"
import { fillTemplate } from 'markmap-render';
import { MindMap } from "./MindMap"
import { useState } from "react";

export const MindMapContainer = ({ markdown }) => {
    const [instanceData, setInstanceData] = useState(null)

    const getData = (data) => {
        setInstanceData(data)
    }


    const handleDownload = () => {
        if (!instanceData) return;

        try {
            const { root, assets } = instanceData;

            // Use fillTemplate to generate complete HTML
            const htmlContent = fillTemplate(root, assets);

            // Create a blob and download
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'mindmap.html';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading mindmap:', error);
        }
    }

    const handleFit = () => {
        if (instanceData.markapInstance) {
            instanceData.markapInstance.fit()
        }
    }

    const handleSave = async () => {
        const localData = JSON.parse(localStorage.getItem('mindmap'))
        const data = {
            title: localData[0].title,
            markdown_content: localData[0].markdown_content
        }

        try {
            const dbResponse = await fetch('http://localhost:8080/api/save-map', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const dbData = await dbResponse.json()

            if (!dbData.success) {
                console.log("Unable to save the Mindmap: ", dbData.message)
            }

            alert(dbData.message)

        } catch (error) {
            console.log("Error while saving the mindmap: ", error.message)
        }
    }

    return (
        <div className="w-screen px-10 mt-5">
            <div className="flex justify-between ">
                <div>
                    <HomeBtn >
                        <House />
                    </HomeBtn>
                </div>
                <div className="flex gap-2.5 mb-2.5">
                    <MapButton name={"Fit"} handleClick={handleFit}>
                        <Search />
                    </MapButton>
                    <MapButton name={"Download"} handleClick={handleDownload}>
                        <Download />
                    </MapButton>
                    <MapButton name={"Save"} handleClick={handleSave}  >
                        <SaveIcon />
                    </MapButton>
                </div>
            </div>
            <div className="border h-180 rounded-2xl">
                <MindMap markdown={markdown} handleData={getData} />
            </div>
        </div>
    )
}