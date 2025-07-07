import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gallery.css';
import Nav from "../Nav/nav";

const Gallery = () => {
    const [image, setImage] = useState(null);
    const [allImage, setAllImage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const submitImg = async (e) => {
        e.preventDefault();
        
        if (!image) {
            alert('Please select an image first!');
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append("image", image);

        try {
            const result = await axios.post("http://localhost:5000/uploadImg", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });

            if (result.data.status === "ok") {
                alert('Image uploaded successfully!');
                setImage(null);
                setPreviewUrl(null);
                setUploadProgress(0);
                getImage();
                // Reset file input
                document.getElementById('file-input').value = '';
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert('Error uploading image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size should be less than 10MB');
                e.target.value = '';
                return;
            }
            
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
                e.target.value = '';
                return;
            }

            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const getImage = async () => {
        try {
            const result = await axios.get("http://localhost:5000/getImage");
            if (result.data.status === "ok") {
                setAllImage(result.data.data);
            }
        } catch (err) {
            console.error("Error getting image:", err);
            alert('Error loading images. Please refresh the page.');
        }
    };

    const deleteImage = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                const result = await axios.delete(`http://localhost:5000/deleteImage/${id}`);
                if (result.data.status === "ok") {
                    alert('Image deleted successfully!');
                    getImage(); // Refresh the image list
                }
            } catch (error) {
                console.error("Error deleting image:", error);
                alert('Error deleting image. Please try again.');
            }
        }
    };

    const openModal = (imageData) => {
        setSelectedImage(imageData);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedImage(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        getImage();
    }, []);

    return (
        <div>  <Nav/>
        <div className="gallery-container">
            <div className="gallery-header">
                <h1>Gallery</h1>
                <p>Upload and manage your images</p>
            </div>

            <div className="upload-section">
                <form onSubmit={submitImg} className="upload-form">
                    <div className="file-input-container">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImgChange}
                            className="file-input"
                            id="file-input"
                        />
                        <label htmlFor="file-input" className="file-label">
                            <span className="file-icon">📁</span>
                            <span className="file-text">
                                {image ? image.name : 'Choose File'}
                            </span>
                        </label>
                    </div>

                    {previewUrl && (
                        <div className="preview-container">
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className="preview-image"
                            />
                            <div className="preview-info">
                                <p><strong>Name:</strong> {image.name}</p>
                                <p><strong>Size:</strong> {formatFileSize(image.size)}</p>
                                <p><strong>Type:</strong> {image.type}</p>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="progress-container">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="progress-text">{uploadProgress}% uploaded</p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className={`upload-btn ${loading ? 'loading' : ''}`}
                        disabled={loading || !image}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>

            <div className="gallery-section">
                <h2>Your Images ({allImage.length})</h2>
                
                {allImage.length === 0 ? (
                    <div className="empty-gallery">
                        <div className="empty-icon">🖼️</div>
                        <p>No images uploaded yet. Upload your first image!</p>
                    </div>
                ) : (
                    <div className="image-grid">
                        {allImage.map((data) => (
                            <div key={data._id} className="image-card">
                                <div className="image-wrapper">
                                    <img 
                                        src={`/images/${data.image}`} 
                                        alt={data.originalName}
                                        className="gallery-image"
                                        onClick={() => openModal(data)}
                                    />
                                    <div className="image-overlay">
                                        <button 
                                            className="view-btn-gallery"
                                            onClick={() => openModal(data)}
                                            title="View Image"
                                        >
                                            👁️
                                        </button>
                                        <button 
                                            className="delete-btn-gallery"
                                            onClick={() => deleteImage(data._id)}
                                            title="Delete Image"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="image-details">
                                    <p className="image-name">{data.originalName}</p>
                                    <p className="image-meta">
                                        {formatFileSize(data.size)} • {formatDate(data.uploadDate)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for viewing full-size image */}
            {showModal && selectedImage && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            ✕
                        </button>
                        <img
                            src={`/images/${selectedImage.image}`}
                            alt={selectedImage.originalName}
                            className="modal-image"
                        />
                        <div className="modal-info">
                            <h3>{selectedImage.originalName}</h3>
                            <p>{formatFileSize(selectedImage.size)} • {formatDate(selectedImage.uploadDate)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default Gallery;