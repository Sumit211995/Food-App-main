import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry'; // Ensure the worker is imported

const PdfUploadFirstPage = () => {
    const [firstPageImage, setFirstPageImage] = useState(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            try {
                // Read the PDF file as an ArrayBuffer
                const arrayBuffer = await file.arrayBuffer();
    
                // Load the PDF using pdfjs
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
                // Get the first page
                const firstPage = await pdf.getPage(1);
    
                // Desired rendering size
                const targetWidth = 500; // Set desired width
                const targetHeight = 600; // Set desired height
    
                // Get the viewport and calculate the scale
                const viewport = firstPage.getViewport({ scale: 1 });
                const scale = Math.min(
                    targetWidth / viewport.width,
                    targetHeight / viewport.height
                );
    
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
    
                // Set canvas size based on the scaled viewport
                canvas.width = viewport.width * scale;
                canvas.height = viewport.height * scale;
    
                const renderContext = {
                    canvasContext: context,
                    viewport: firstPage.getViewport({ scale }),
                };
    
                // Render the page to the canvas
                await firstPage.render(renderContext).promise;
    
                // Convert the canvas to a base64 image
                const imageUrl = canvas.toDataURL('image/png');
    
                // Set the image URL to state for rendering
                setFirstPageImage(imageUrl);
            } catch (error) {
                console.error('Error processing PDF:', error);
            }
        } else {
            alert('Please upload a valid PDF file.');
        }
    };
    

    return (
        <div>
            <h1>Upload and Preview First Page of PDF</h1>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} />
            {firstPageImage && (
                <div
                    style={{
                        width: '500px', // Match the rendering size
                        height: '600px', // Match the rendering size
                        overflow: 'hidden',
                        border: '1px solid #ddd',
                    }}
                >
                    <img
                        src={firstPageImage}
                        alt="PDF First Page"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            )}
        </div>
    );
};

export default PdfUploadFirstPage;
