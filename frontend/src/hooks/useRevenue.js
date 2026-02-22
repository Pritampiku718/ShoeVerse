// frontend/src/hooks/useRevenue.js
import { useState } from 'react';
import { adminAPI } from '../services/api';

export const useRevenue = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminAPI.getDashboardStats();
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRevenueData = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminAPI.getRevenueStats(params);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching revenue data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getDashboardData, getRevenueData, loading, error };
};