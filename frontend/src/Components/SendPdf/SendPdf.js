import React, { useEffect, useState } from 'react';
import Nav from "../Nav/nav";
import axios from 'axios';
import './sendpdf.css'

function SendPdf() {
      // State variables
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [allPdf, setAllPdf] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Fetch PDFs when component mounts
  useEffect(() => {
    getPdf();
  }, []);

  // Function to fetch all PDFs from backend
  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:5000/getfile");
      console.log('Fetched PDFs:', result.data.data);
      setAllPdf(result.data.data || []);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      setError("Failed to fetch PDFs");
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        alert('Please select a PDF file only');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Validate file size (optional - 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > maxSize) {
        alert('File size should not exceed 10MB');
        e.target.value = ''; // Clear the input
        return;
      }
      
      console.log('Selected file:', selectedFile);
      setFile(selectedFile);
    }
  };

  // Handle title input change
  const handleTitleChange = (e) => {
    const titleValue = e.target.value;
    console.log('Title changed:', titleValue);
    setTitle(titleValue);
  };

  // Handle form submission
  const submitPdf = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log('=== FORM SUBMISSION ===');
    console.log('Title:', title);
    console.log('File:', file);
    
    // Validation
    if (!title || title.trim() === '') {
      alert('Please enter a title');
      return;
    }
    
    if (!file) {
      alert('Please select a file');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("file", file);
      
      // Debug FormData
      console.log('=== FORMDATA DEBUG ===');
      console.log('FormData has title:', formData.has('title'));
      console.log('FormData has file:', formData.has('file'));
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      // Send request to backend
      const result = await axios.post(
        "http://localhost:5000/uploadfile",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('Upload result:', result);
      
      if (result.data.status === 200) {
        alert("Upload Successful!");
        
        // Reset form
        setTitle('');
        setFile(null);
        document.getElementById('file-input').value = '';
        
        // Refresh PDF list
        getPdf();
      } else {
        alert("Upload Error: " + (result.data.message || 'Unknown error'));
      }
      
    } catch (error) {
      console.error("Error uploading:", error);
      
      let errorMessage = "Error uploading file";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle PDF viewing (optional)
  const viewPdf = (pdfName) => {
    window.open(`http://localhost:5000/files/${pdfName}`, '_blank');
  };

  // Handle PDF deletion (optional)
  const deletePdf = async (pdfId) => {
    if (window.confirm('Are you sure you want to delete this PDF?')) {
      try {
        await axios.delete(`http://localhost:5000/deletefile/${pdfId}`);
        alert('PDF deleted successfully');
        getPdf(); // Refresh list
      } catch (error) {
        console.error("Error deleting PDF:", error);
        alert('Error deleting PDF');
      }
    }
  };
  return (
    <div> 
          <Nav/>
    <div className="pdf-upload-container">
      <div className="upload-section">
        <h2>PDF Upload System</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={submitPdf} className="upload-form">
          <div className="form-group">
            <label htmlFor="title-input">Title:</label>
            <input 
              id="title-input"
              type="text" 
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter PDF title"
              required
              disabled={isUploading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="file-input">Select PDF File:</label>
            <input 
              id="file-input"
              type="file" 
              onChange={handleFileChange}
              accept=".pdf"
              required
              disabled={isUploading}
            />
            {file && (
              <div className="file-info">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isUploading}
            className="upload-btn"
          >
            {isUploading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>
      </div>
      
      <div className="pdf-list-section">
        <h3>Uploaded PDFs ({allPdf.length})</h3>
        
        {allPdf.length === 0 ? (
          <p className="no-pdfs">No PDFs uploaded yet.</p>
        ) : (
          <div className="pdf-list">
            {allPdf.map((pdf, index) => (
              <div key={pdf._id || index} className="pdf-item">
                <div className="pdf-info">
                  <h4>{pdf.title}</h4>
                  <p>File: {pdf.pdf}</p>
                </div>
                <div className="pdf-actions">
                  <button 
                    onClick={() => viewPdf(pdf.pdf)}
                    className="view-btn"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => deletePdf(pdf._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default SendPdf
