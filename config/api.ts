// API Configuration
export const API_CONFIG = {
  // Development URL - change this to your backend server URL
  DEV_BASE_URL: 'http://localhost:3000',
  
  // Production URL - replace with your production backend URL
  PROD_BASE_URL: 'https://your-production-api.com',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Get the appropriate base URL based on environment
export const getApiBaseUrl = (): string => {
  return __DEV__ ? API_CONFIG.DEV_BASE_URL : API_CONFIG.PROD_BASE_URL;
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  // Add more endpoints as needed
} as const;
