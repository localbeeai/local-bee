// Helper function to construct correct image URLs for development and production
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // In production, use relative paths
    return `/${cleanPath}`;
  } else {
    // In development, use the backend server URL
    const hostname = window.location.hostname === 'localhost' ? '192.168.0.71' : window.location.hostname;
    return `http://${hostname}:5000/${cleanPath}`;
  }
};

// Helper to get full backend URL for API or file serving
export const getBackendUrl = (path = '') => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return path;
  } else {
    const hostname = window.location.hostname === 'localhost' ? '192.168.0.71' : window.location.hostname;
    return `http://${hostname}:5000${path}`;
  }
};