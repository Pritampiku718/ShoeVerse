import { create } from 'zustand';
import { uploadAPI } from '../services/api';
import { toast } from 'react-hot-toast';

export const useUploadStore = create((set, get) => ({
  uploading: false,
  uploadedImages: [],

  // Upload single image
  uploadImage: async (file) => {
    set({ uploading: true });
    try {
      const response = await uploadAPI.uploadSingle(file);
      toast.success('Image uploaded successfully');
      set({ uploading: false });
      return response.data.file;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      set({ uploading: false });
      throw error;
    }
  },

  // Upload multiple images
  uploadMultipleImages: async (files) => {
    set({ uploading: true });
    try {
      const response = await uploadAPI.uploadMultiple(files);
      toast.success(`${files.length} images uploaded successfully`);
      set({ 
        uploadedImages: [...get().uploadedImages, ...response.data.files],
        uploading: false 
      });
      return response.data.files;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      set({ uploading: false });
      throw error;
    }
  },

  // Delete image
  deleteImage: async (publicId) => {
    try {
      await uploadAPI.deleteImage(publicId);
      set({ uploadedImages: get().uploadedImages.filter(img => img.publicId !== publicId) });
      toast.success('Image deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
      throw error;
    }
  },

  // Clear uploaded images
  clearUploadedImages: () => {
    set({ uploadedImages: [] });
  },
}));