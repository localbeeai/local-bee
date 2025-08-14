import React, { useState, useCallback, useRef } from 'react';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';

const UploadContainer = styled.div`
  margin-bottom: 2rem;
`;

const DropZone = styled.div`
  border: 2px dashed ${props => props.$isDragActive ? 'var(--primary-green)' : 'var(--border-light)'};
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  background: ${props => props.$isDragActive ? 'var(--secondary-green)' : 'var(--natural-beige)'};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: var(--primary-green);
    background: var(--secondary-green);
  }

  .upload-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  .upload-text {
    color: var(--text-dark);
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .upload-subtext {
    color: var(--text-light);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .file-requirements {
    color: var(--text-light);
    font-size: 0.75rem;
    line-height: 1.4;
  }

  input[type="file"] {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
  border: 2px solid ${props => props.$isFeatured ? 'var(--primary-green)' : 'var(--border-light)'};
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
  }

  .image-actions {
    display: flex;
    gap: 0.5rem;

    button {
      padding: 0.5rem;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
      color: white;
      font-weight: 500;

      &.delete {
        background: #ef4444;
      }

      &.feature {
        background: var(--primary-green);
      }
    }
  }

  .featured-badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background: var(--primary-green);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .drag-handle {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: grab;
  }
`;

const UploadProgress = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: var(--natural-beige);
  border-radius: 0.5rem;

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--border-light);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.5rem;

    .progress-fill {
      height: 100%;
      background: var(--primary-green);
      transition: width 0.3s;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const ImageUpload = ({ images = [], onImagesChange, maxImages = 10 }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const validateFile = useCallback((file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP formats are allowed';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  }, []);

  const uploadFiles = useCallback(async (files) => {
    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      for (let file of files) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          setUploading(false);
          return;
        }
        formData.append('images', file);
      }

      const response = await axios.post('/api/upload/product-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const newImages = response.data.images.map((img, index) => ({
        url: img.url,
        filename: img.filename,
        isFeatured: images.length === 0 && index === 0 // First image of empty gallery becomes featured
      }));

      onImagesChange([...images, ...newImages]);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [images, onImagesChange, validateFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (files.length > 0) {
      uploadFiles(files);
    }
  }, [images.length, maxImages, uploadFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (files.length > 0) {
      uploadFiles(files);
    }

    // Reset input
    e.target.value = '';
  }, [images.length, maxImages, uploadFiles]);

  const handleDeleteImage = async (index) => {
    const imageToDelete = images[index];
    
    try {
      if (imageToDelete.filename) {
        await axios.delete(`/api/upload/image/${imageToDelete.filename}`);
      }

      const updatedImages = images.filter((_, i) => i !== index);
      
      // If we deleted the featured image and there are still images, make the first one featured
      if (imageToDelete.isFeatured && updatedImages.length > 0) {
        updatedImages[0].isFeatured = true;
      }

      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete image');
    }
  };

  const handleSetFeatured = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isFeatured: i === index
    }));
    console.log('Setting featured image:', updatedImages); // Debug log
    onImagesChange(updatedImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    onImagesChange(updatedImages);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleImageDrop = (e, toIndex) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (fromIndex !== toIndex) {
      moveImage(fromIndex, toIndex);
    }
  };

  return (
    <UploadContainer>
      <h4 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
        Product Images {images.length > 0 && `(${images.length}/${maxImages})`}
      </h4>

      {images.length < maxImages && (
        <DropZone
          $isDragActive={isDragActive}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
          />
          
          <div className="upload-icon">📷</div>
          <div className="upload-text">
            {isDragActive ? 'Drop images here' : 'Drag & drop images or click to browse'}
          </div>
          <div className="upload-subtext">
            Upload up to {maxImages} high-quality images
          </div>
          <div className="file-requirements">
            • Supported formats: JPEG, PNG, WebP<br/>
            • Maximum size: 5MB per image<br/>
            • First image will be your featured photo
          </div>
        </DropZone>
      )}

      {uploading && (
        <UploadProgress>
          <div>Uploading images... {uploadProgress}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </UploadProgress>
      )}

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      {images.length > 0 && (
        <ImageGrid>
          {images.map((image, index) => (
            <ImagePreview
              key={`${image.filename}-${index}`}
              $isFeatured={image.isFeatured}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleImageDrop(e, index)}
            >
              <img 
                src={getImageUrl(image.url)} 
                alt={`Product ${index + 1}`}
                onError={(e) => {
                  e.target.src = '/placeholder-image.png';
                }}
              />
              
              {image.isFeatured && (
                <div className="featured-badge">Featured</div>
              )}
              
              <div className="drag-handle">⋮⋮</div>
              
              <div className="image-overlay">
                <div className="image-actions">
                  {!image.isFeatured && (
                    <button 
                      className="feature"
                      onClick={() => handleSetFeatured(index)}
                    >
                      Set Featured
                    </button>
                  )}
                  <button 
                    className="delete"
                    onClick={() => handleDeleteImage(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </ImagePreview>
          ))}
        </ImageGrid>
      )}

      {images.length > 0 && (
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-light)', 
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          💡 Tip: Drag images to reorder them. The featured image appears first in search results.
        </p>
      )}
    </UploadContainer>
  );
};

export default ImageUpload;