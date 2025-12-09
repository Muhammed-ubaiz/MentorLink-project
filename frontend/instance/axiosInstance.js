import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // Your API base URL
});

// Request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage based on user type
    const token = localStorage.getItem('adminToken') || localStorage.getItem('mentorToken') || localStorage.getItem('studentToken');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired, redirect to login
      localStorage.removeItem('adminToken');
      localStorage.removeItem('mentorToken');
      // localStorage.removeItem('studentToken');
      localStorage.removeItem('userType');
      window.location.href = '/adminlogin'; // Adjust based on your routing
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;