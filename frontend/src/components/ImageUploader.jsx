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

  // Always store images as objects
  const [images, setImages] = useState(existingImages);

  /* =====================================================
     ✅ FILE SELECT + MULTIPLE UPLOAD
  ===================================================== */
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    /* ===============================
       ✅ VALIDATION
    =============================== */
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

      files.forEach((file) => {
        formData.append("images", file);
      });

      console.log("Uploading files:", files.length);

      toast.loading(`Uploading ${files.length} image(s)...`, {
        id: "upload",
      });

      /* ===============================
         ✅ API CALL
      =============================== */
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

      console.log("Upload response:", data);

      /* ===============================
         ✅ STORE IMAGES AS OBJECTS
      =============================== */
      if (data && data.files) {
        const newImages = data.files.map((file, index) => ({
          url: file.url, // Cloudinary URL

          // ✅ FIXED: Correct Cloudinary Public ID
          publicId: file.publicId,

          alt: files[index].name,
          isPrimary: images.length === 0 && index === 0,
        }));

        const updatedImages = [...images, ...newImages];

        setImages(updatedImages);

        // Send back to parent
        onImageUpload(updatedImages);

        toast.success(`${data.files.length} image(s) uploaded successfully`, {
          id: "upload",
        });
      }

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error("Upload error:", error);

      let errorMessage = "Error uploading image";

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

  /* =====================================================
     ✅ REMOVE IMAGE (Cloudinary Delete)
  ===================================================== */
  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];

    try {
      toast.loading("Removing image...", { id: "remove" });

      if (imageToRemove.publicId) {
        await axiosInstance.delete(`/upload/${imageToRemove.publicId}`);
      }

      toast.success("Image removed successfully", { id: "remove" });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to remove image", { id: "remove" });
    }

    /* ===============================
       ✅ UPDATE STATE AFTER REMOVE
    =============================== */
    const updatedImages = images.filter((_, i) => i !== index);

    // Ensure one primary remains
    if (updatedImages.length > 0 && !updatedImages.some((img) => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }

    setImages(updatedImages);
    onImageUpload(updatedImages);
  };

  /* =====================================================
     ✅ SET PRIMARY IMAGE
  ===================================================== */
  const setPrimaryImage = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));

    setImages(updatedImages);
    onImageUpload(updatedImages);

    toast.success("Primary image updated");
  };

  /* =====================================================
     ✅ UI RENDER
  ===================================================== */
  return (
    <div className="image-uploader">
      {/* ERROR ALERT */}
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

      {/* IMAGE PREVIEW GRID */}
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
                alt={image.alt}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/150?text=Image+Error";
                }}
              />

              {/* PRIMARY BADGE */}
              {image.isPrimary && (
                <span className="primary-badge">
                  <FaCheckCircle /> Primary
                </span>
              )}

              {/* REMOVE BUTTON */}
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

      {/* UPLOAD INPUT */}
      <div className="upload-area">
        <Form.Control
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleFileSelect}
          multiple
          disabled={uploading}
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
                label={`${uploadProgress}%`}
              />
            </div>
          ) : (
            <div className="upload-prompt">
              <FaCloudUploadAlt className="upload-icon" />
              <span className="upload-text">Click to upload images</span>
              <span className="upload-hint">
                JPG, PNG, WebP, GIF up to 5MB
              </span>
            </div>
          )}
        </label>
      </div>

      {/* EMPTY STATE */}
      {images.length === 0 && !uploading && (
        <div className="text-muted text-center mt-3">
          <FaImage className="me-2" />
          No images uploaded yet
        </div>
      )}

      {/* FOOTER */}
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
