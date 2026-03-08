import { fillTemplate } from 'markmap-render';

export const handleDownload = (instanceData, title) => {
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
        link.download = `${title.trim()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading mindmap:', error);
    }
}

export const handleFit = (instanceData) => {
    if (instanceData.markapInstance) {
        instanceData.markapInstance.fit()
    }
}

// slider method
export const handleMouseDown = (e,containerRef,leftWidth,setLeftWidth) => {
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