import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './ConvertedFilePanel.css'; // Create a CSS file for styling
import { saveAs } from 'file-saver'; // Import saveAs

const ConvertedFilePanel = ({ file, isOpen, onClose }) => {
  if (!isOpen) return null; // Don't render if the panel is not open

  const handleDownload = () => {
    saveAs(file.url, file.name); // Use saveAs to download the file
  };

  return (
    <div className="converted-file-panel">
      <button className="close-button" onClick={onClose}>Close</button>
      <h2>Converted File</h2>
      {file && (
        <div>
          <p><strong>Name:</strong> {file.name}</p>
          <p><strong>Type:</strong> {file.type}</p>
          <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
          <button onClick={handleDownload} className="download-link">
            <FontAwesomeIcon icon={faDownload} />
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default ConvertedFilePanel;
