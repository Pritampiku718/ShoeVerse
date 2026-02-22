// frontend/src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // ======================================
      // REGISTER
      // ======================================
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          toast.success('Registration successful! Please login.');
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      // ======================================
      // LOGIN - WITH ADMIN REDIRECT LOGIC
      // ======================================
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login({ email, password });
          console.log('Login response:', response.data); // Debug log
          
          // Handle different response structures
          let token = null;
          let user = null;
          
          if (response.data.token && response.data.user) {
            // Structure: { token, user }
            token = response.data.token;
            user = response.data.user;
          } else if (response.data.data && response.data.data.token) {
            // Structure: { data: { token, user } }
            token = response.data.data.token;
            user = response.data.data.user;
          } else if (response.data.accessToken) {
            // Structure: { accessToken, user }
            token = response.data.accessToken;
            user = response.data.user;
          } else {
            // Fallback
            token = response.data.token;
            user = response.data;
          }
          
          // Ensure user object has isAdmin and role properties
          if (user) {
            // If isAdmin exists in the response, set role accordingly
            if (user.isAdmin === true) {
              user.role = 'admin';
            } else if (user.role) {
              // If role exists, set isAdmin based on role
              user.isAdmin = user.role === 'admin';
            } else {
              // Default values
              user.isAdmin = user.isAdmin || false;
              user.role = user.isAdmin ? 'admin' : 'user';
            }
          }
          
          // Store token and user
          localStorage.setItem('token', token);
          
          set({ 
            user, 
            token, 
            isLoading: false,
            error: null 
          });
          
          toast.success(`Welcome back, ${user.name || 'User'}!`);
          
          // Return the full user object
          return user;
        } catch (error) {
          console.error('Login error:', error);
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      // ======================================
      // LOGOUT
      // ======================================
      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null,
          error: null 
        });
        toast.success('Logged out successfully');
      },

      // ======================================
      // GET PROFILE
      // ======================================
      getProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.getProfile();
          console.log('Profile response:', response.data); // Debug log
          
          let userData = null;
          
          // Handle different response structures
          if (response.data.data) {
            userData = response.data.data;
          } else if (response.data.user) {
            userData = response.data.user;
          } else {
            userData = response.data;
          }
          
          // Ensure admin flags are set
          if (userData) {
            if (userData.isAdmin === true) {
              userData.role = 'admin';
            } else if (userData.role === 'admin') {
              userData.isAdmin = true;
            }
          }
          
          set({ 
            user: userData, 
            isLoading: false 
          });
          
          return userData;
        } catch (error) {
          console.error('Get profile error:', error);
          const message = error.response?.data?.message || 'Failed to get profile';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // ======================================
      // UPDATE PROFILE
      // ======================================
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.updateProfile(data);
          console.log('Update profile response:', response.data);
          
          let token = null;
          let user = null;
          
          if (response.data.token) {
            token = response.data.token;
            user = response.data.user || response.data;
          } else if (response.data.data) {
            token = response.data.data.token;
            user = response.data.data.user || response.data.data;
          } else {
            user = response.data;
          }
          
          // Update token if provided
          if (token) {
            localStorage.setItem('token', token);
          }
          
          // Ensure admin flags are set
          if (user) {
            if (user.isAdmin === true) {
              user.role = 'admin';
            } else if (user.role === 'admin') {
              user.isAdmin = true;
            }
          }
          
          set({ 
            user, 
            token: token || get().token, 
            isLoading: false 
          });
          
          toast.success('Profile updated successfully');
          return user;
        } catch (error) {
          const message = error.response?.data?.message || 'Update failed';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      // ======================================
      // UPDATE AVATAR
      // ======================================
      updateAvatar: async (file) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('avatar', file);
          
          const response = await authAPI.updateAvatar(formData);
          let userData = response.data.data || response.data;
          
          set({ 
            user: userData, 
            isLoading: false 
          });
          
          toast.success('Avatar updated successfully');
          return userData;
        } catch (error) {
          const message = error.response?.data?.message || 'Avatar update failed';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      // ======================================
      // CHANGE PASSWORD
      // ======================================
      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.changePassword({ currentPassword, newPassword });
          toast.success('Password changed successfully');
          set({ isLoading: false });
        } catch (error) {
          const message = error.response?.data?.message || 'Password change failed';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw error;
        }
      },

      // ======================================
      // CLEAR ERROR
      // ======================================
      clearError: () => {
        set({ error: null });
      },

      // ======================================
      // HELPER FUNCTIONS
      // ======================================
      
      // Check if user is authenticated
      isAuthenticated: () => {
        return !!get().token;
      },

      // Check if user is admin - IMPROVED
      isAdmin: () => {
        const { user } = get();
        if (!user) return false;
        
        // Check both isAdmin flag and role
        return user.isAdmin === true || user.role === 'admin';
      },

      // Get user role
      getUserRole: () => {
        const { user } = get();
        if (!user) return 'guest';
        if (user.isAdmin === true || user.role === 'admin') return 'admin';
        return user.role || 'user';
      },

      // Check if current user matches given id
      isCurrentUser: (userId) => {
        const { user } = get();
        return user?._id === userId;
      },
      
      // Get full name
      getFullName: () => {
        const { user } = get();
        return user?.name || 'User';
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
      // Only persist these fields
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);