import React, { useState } from "react";
import { Form, ProgressBar, Alert } from "react-bootstrap";
import {
  FaCloudUploadAlt,
  FaTrash,
  FaImage,
  FaCheckCircle,
} from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import "./ImageUploader.css";

const ImageUploader = ({ onImageUpload, existingImages = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [images, setImages] = useState(existingImages);

  /* =====================================
     ✅ Upload Images Handler
  ====================================== */
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    /* ================================
       ✅ Validate File Types
    ================================= */
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError("Only JPG, PNG, WebP, and GIF images are allowed");
      toast.error("Only JPG, PNG, WebP, and GIF images are allowed");
      return;
    }

    /* ================================
       ✅ Validate File Size (5MB)
    ================================= */
    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setError("File size must be less than 5MB");
      toast.error("File size must be less than 5MB");
      return;
    }

    setError("");
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Append all selected files
      files.forEach((file) => {
        formData.append("images", file);
      });

      toast.loading(`Uploading ${files.length} image(s)...`, {
        id: "upload",
      });

      const { data } = await axiosInstance.post(
        "/upload/multiple",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      console.log("Upload Response:", data);

      /* ================================
         ✅ Store Images as Objects
      ================================= */
      if (data && data.files) {
        const updatedImages = [...images, ...data.files];

        // Ensure at least one primary image
        if (!updatedImages.some((img) => img.isPrimary)) {
          updatedImages[0].isPrimary = true;
        }

        setImages(updatedImages);
        onImageUpload(updatedImages);

        toast.success(`${data.files.length} image(s) uploaded successfully`, {
          id: "upload",
        });
      }

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error("Upload Error:", error);

      let errorMessage = "Error uploading images";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check backend deployment.";
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage, { id: "upload" });
    } finally {
      setUploading(false);
    }
  };

  /* =====================================
     ✅ Remove Image Handler
  ====================================== */
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);

    // Ensure one primary remains
    if (
      updatedImages.length > 0 &&
      !updatedImages.some((img) => img.isPrimary)
    ) {
      updatedImages[0].isPrimary = true;
    }

    setImages(updatedImages);
    onImageUpload(updatedImages);

    toast.success("Image removed successfully");
  };

  /* =====================================
     ✅ Set Primary Image Handler
  ====================================== */
  const setPrimaryImage = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));

    setImages(updatedImages);
    onImageUpload(updatedImages);

    toast.success("Primary image updated!");
  };

  return (
    <div className="image-uploader">
      {/* Error Alert */}
      {error && (
        <Alert
          variant="danger"
          className="mb-3"
          onClose={() => setError("")}
          dismissible
        >
          {error}
        </Alert>
      )}

      {/* ================================
         ✅ Image Preview Grid
      ================================= */}
      {images.length > 0 && (
        <div className="image-preview-grid mb-3">
          {images.map((image, index) => (
            <div
              key={index}
              className={`image-preview-item ${
                image.isPrimary ? "primary" : ""
              }`}
              onClick={() => setPrimaryImage(index)}
            >
              <img
                src={image.url}
                alt={image.alt || "Product Image"}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/150?text=No+Image";
                }}
              />

              {/* Primary Badge */}
              {image.isPrimary && (
                <span className="primary-badge">
                  <FaCheckCircle /> Primary
                </span>
              )}

              {/* Remove Button */}
              <button
                type="button"
                className="remove-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================================
         ✅ Upload Input Area
      ================================= */}
      <div className="upload-area">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        <label htmlFor="image-upload" className="upload-label">
          {uploading ? (
            <div className="uploading-state">
              <FaCloudUploadAlt className="upload-icon spinning" />
              <span>Uploading... {uploadProgress}%</span>

              <ProgressBar
                now={uploadProgress}
                className="upload-progress"
              />
            </div>
          ) : (
            <div className="upload-prompt">
              <FaCloudUploadAlt className="upload-icon" />
              <span className="upload-text">
                Click to upload images
              </span>
              <span className="upload-hint">
                JPG, PNG, WebP, GIF up to 5MB
              </span>
            </div>
          )}
        </label>
      </div>

      {/* No Images Message */}
      {images.length === 0 && !uploading && (
        <div className="text-muted text-center mt-3">
          <FaImage className="me-2" />
          No images uploaded yet
        </div>
      )}

      {/* Footer Note */}
      {images.length > 0 && (
        <div className="image-uploader-footer mt-2">
          <small className="text-muted">
            <FaCheckCircle className="text-success me-1" />
            Click any image to make it primary
          </small>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
