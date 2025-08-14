import axios from 'axios';

// Configure axios base URL for mobile development
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Check if running on mobile (not localhost)
const isMobile = isDevelopment && window.location.hostname !== 'localhost';

// Set base URL based on environment
let baseURL;
if (isProduction) {
  baseURL = '/api'; // Use relative path in production
} else {
  // In development, use localhost for local testing or the current hostname for mobile testing
  const hostname = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
  baseURL = `http://${hostname}:5000`;
}

console.log('API Configuration:', {
  hostname: window.location.hostname,
  isMobile,
  baseURL,
  isDevelopment,
  isProduction
});

// Create a new axios instance with the correct base URL
const apiInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

// Add request interceptor for debugging
apiInstance.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'Base URL:', config.baseURL);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiInstance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.config?.url, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiInstance;