// easyconvert/src/components/ImageConverter.js
import React, { useState } from 'react';
import './ImageConverter.css';
import ConvertedFilePanel from './ConvertedFilePanel'; // Import the side panel
import { saveAs } from 'file-saver';

const formats = {
    // Raster Formats
    'jpeg': { mime: 'image/jpeg', ext: '.jpeg' },
    'jpg': { mime: 'image/jpeg', ext: '.jpg' },
    'png': { mime: 'image/png', ext: '.png' },
    'gif': { mime: 'image/gif', ext: '.gif' },
    'bmp': { mime: 'image/bmp', ext: '.bmp' },
    'tiff': { mime: 'image/tiff', ext: '.tiff' },
    'webp': { mime: 'image/webp', ext: '.webp' },
    'heic': { mime: 'image/heic', ext: '.heic' },
    'raw': { mime: 'image/raw', ext: '.raw' },
    'pcx': { mime: 'image/pcx', ext: '.pcx' },
    'tga': { mime: 'image/tga', ext: '.tga' },
    'ico': { mime: 'image/x-icon', ext: '.ico' },
    'hdr': { mime: 'image/vnd.radiance', ext: '.hdr' },
    'exr': { mime: 'image/x-exr', ext: '.exr' },

    // Vector Formats
    'svg': { mime: 'image/svg+xml', ext: '.svg' },
    'eps': { mime: 'application/postscript', ext: '.eps' },
    'pdf': { mime: 'application/pdf', ext: '.pdf' },
    'ai': { mime: 'application/postscript', ext: '.ai' },
    'wmf': { mime: 'image/wmf', ext: '.wmf' },
    'emf': { mime: 'image/emf', ext: '.emf' },

    // Animation Formats
    'apng': { mime: 'image/apng', ext: '.apng' },
    'mng': { mime: 'video/x-mng', ext: '.mng' },

    // Professional Formats
    'psd': { mime: 'image/vnd.adobe.photoshop', ext: '.psd' },
    'xcf': { mime: 'image/x-xcf', ext: '.xcf' },
    'cdr': { mime: 'application/cdr', ext: '.cdr' },

    // Scientific/Technical Formats
    'fits': { mime: 'image/fits', ext: '.fits' },
    'pgf': { mime: 'image/pgf', ext: '.pgf' },
    'pbm': { mime: 'image/x-portable-bitmap', ext: '.pbm' },
    'pgm': { mime: 'image/x-portable-graymap', ext: '.pgm' },
    'ppm': { mime: 'image/x-portable-pixmap', ext: '.ppm' }
};

function ImageConverter() {
    const [fromFormat, setFromFormat] = useState('jpg');
    const [toFormat, setToFormat] = useState('png');
    const [files, setFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [convertedFile, setConvertedFile] = useState(null); // State for converted file
    const [isPanelOpen, setIsPanelOpen] = useState(false); // State for panel visibility

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setErrorMessage(''); // Clear error message when files are selected
    };

    const handleConvert = () => {
        if (files.length === 0) {
            setErrorMessage('Please choose a file or folder to convert.'); // Set error message
            return;
        }

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    const newFormat = toFormat;
                    canvas.toBlob((blob) => {
                        const convertedFile = new File([blob], `${file.name.split('.')[0]}_converted.${newFormat}`, { type: formats[newFormat].mime });
                        setConvertedFile({ name: convertedFile.name, type: convertedFile.type, size: convertedFile.size, url: URL.createObjectURL(convertedFile) });
                        setIsPanelOpen(true); // Open the side panel
                    }, formats[newFormat].mime);
                };
            };
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="converter-box">
            <div className="converter-options">
                <div>
                    <label>Convert From</label>
                    <select value={fromFormat} onChange={(e) => setFromFormat(e.target.value)}>
                        {Object.keys(formats).map((format) => (
                            <option key={format} value={format}>
                                {format.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Convert To</label>
                    <select value={toFormat} onChange={(e) => setToFormat(e.target.value)}>
                        {Object.keys(formats).map((format) => (
                            <option key={format} value={format}>
                                {format.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='bothbtn'>
                <div className="file-input">
                    <label className="custom-file-upload">
                        Choose Single File
                        <input
                            type="file"
                            accept={`image/${fromFormat}`}
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
                <div className="file-input">
                    <label className="custom-file-upload">
                        Choose Folder
                        <input
                            type="file"
                            accept={`image/${fromFormat}`}
                            onChange={handleFileChange}
                            webkitdirectory="true" // Allow folder uploads in Chrome
                            multiple // Allow multiple file selection
                            style={{ display: 'none' }} // Hide the default input
                        />
                    </label>
                </div>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={handleConvert}>Convert</button>

            {/* Side Panel for Converted File */}
            <ConvertedFilePanel file={convertedFile} isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
        </div>
    );
}

export default ImageConverter;