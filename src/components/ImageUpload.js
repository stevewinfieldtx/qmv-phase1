import React, { useState } from 'react';

const ImageUpload = ({ images, onImagesChange, maxImages }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (images.length + imageFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }
    
    const newImages = imageFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    onImagesChange([...images, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (id) => {
    const updatedImages = images.filter(img => img.id !== id);
    onImagesChange(updatedImages);
  };

  const handleFileInput = (e) => {
    handleFileSelect(e.target.files);
  };

  return (
    <div className="image-upload-container">
      <div
        className={`upload-area ${dragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <div className="upload-content">
          <p>📸 Drag & drop images here or click to browse</p>
          <p>Maximum {maxImages} images</p>
        </div>
      </div>
      
      {images.length > 0 && (
        <div className="image-preview">
          {images.map(image => (
            <div key={image.id} className="image-item">
              <img src={image.url} alt={image.name} />
              <button
                type="button"
                className="remove-image"
                onClick={() => removeImage(image.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;