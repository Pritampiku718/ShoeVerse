import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const testBackendConnection = async () => {
  console.log('🔍 Testing backend connection...');
  
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ Backend connected:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Backend connection failed:');
    console.error('   Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   👉 Make sure your backend server is running on port 5000');
    }
    
    return { success: false, error: error.message };
  }
};

export const testAuth = async () => {
  console.log('🔍 Testing auth endpoints...');
  
  try {
    // Test login with admin credentials
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@shoeverse.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful:', loginResponse.data);
    return { success: true, data: loginResponse.data };
  } catch (error) {
    console.error('❌ Auth test failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};