import { MapButton } from "../components/Buttons"
import { Download, SaveIcon, RotateCcw, Search } from "lucide-react"
import { fillTemplate } from 'markmap-render';
import { MindMap } from "./MindMap"

export const MindMapContainer = ({markdown}) => {
    let instanceData = ''
    const getData = (data) => {
        instanceData = data
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
        if(instanceData.markapInstance) {
            instanceData.markapInstance.fit()
        }
    }

    return (
        <div className="w-screen px-10 mt-5">
            <div className="flex flex-row-reverse gap-5 mb-2 mr-2">
                <MapButton name={"Fit"} handleClick={handleFit}>
                    <Search />  
                </MapButton>
                <MapButton name={"Download"} handleClick={handleDownload}>
                    <Download />
                </MapButton>
                <MapButton name={"Save"} >
                    <SaveIcon />
                </MapButton>
            </div>
            <div className="border h-180 rounded-2xl">
                <MindMap markdown={markdown} handleData={getData}/>
            </div>
        </div>
    )
}