import React, { useRef, useState } from 'react';
import { PageLayout, Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css'; 
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import customZoomPlugin from './customZoomPlugin';
import { scrollModePlugin } from '@react-pdf-viewer/scroll-mode';

export default function Contact() {
    const uploadRef = useRef(null);
    const [openFile, setOpenFile] = useState(null);

    const customZoomPluginInstance = customZoomPlugin();
    const { zoomTo } = customZoomPluginInstance;

    // Initialize the page navigation plugin
    const pageNavigationPluginInstance = pageNavigationPlugin();

    const scrollModePluginInstance = scrollModePlugin();

    React.useEffect(() => {
        zoomTo(0.5); // Apply zoom level of 50%
    }, [zoomTo]);

    const handleUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const localPreviewUrl = URL.createObjectURL(file);
            setOpenFile(localPreviewUrl);
        }
    };

    

    return (
        <div className="flex flex-col items-center justify-center  bg-gray-100">
            {/* Upload Button */}
            <div className="flex items-center justify-center mb-6">
                <button
                    type="button"
                    className="cursor-pointer border bg-red-500 text-white px-4 py-2 font-bold rounded-lg"
                    onClick={() => {
                        if (uploadRef.current) {
                            uploadRef.current.value = '';
                            uploadRef.current.click();
                        }
                    }}
                >
                    Upload PDF
                </button>
                <input
                    ref={uploadRef}
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleUpload}
                />
            </div>

            {/* PDF Viewer */}
            <div className="w-[25%] h-[400px] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 relative">
                {openFile ? (
                    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
                        <Viewer
                            fileUrl={openFile}
                            plugins={[customZoomPluginInstance, pageNavigationPluginInstance, scrollModePluginInstance]}
                            horizontal={true}
                            ScrollMode= {scrollModePluginInstance.horizontal}
                             // Add the page navigation plugin
                            // defaultScale={0}
                            // initialPage={0} // Start with the first page
                            // style={{
                            //     height: '100%',
                            //     overflow: 'hidden',
                            // }}
                        />
                    </Worker>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                        No file uploaded. Please upload a PDF.
                    </div>
                )}
            </div>

            {/* Page Navigation Controls */}
            {openFile && (
                <div className="flex items-center mt-4 space-x-4">
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() =>
                            pageNavigationPluginInstance.jumpToPreviousPage()
                        }
                    >
                        Previous Page
                    </button>
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => pageNavigationPluginInstance.jumpToNextPage()}
                    >
                        Next Page
                    </button>
                </div>
            )}
        </div>
    );
}