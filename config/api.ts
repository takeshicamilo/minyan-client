// API Configuration
export const API_CONFIG = {
  // Development URL - change this to your backend server URL
  // Use your local IP address instead of localhost for React Native
  DEV_BASE_URL: 'http://192.168.137.14:3000',
  
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
    LOGOUT: '/auth/logout',
  },
  MINYAN: {
    CREATE: '/minyan',
    NEARBY: '/minyan/simple-nearby',
    MY_MINYANIM: '/minyan/my',
    JOIN: (id: number) => `/minyan/${id}/join`,
    LEAVE: (id: number) => `/minyan/${id}/leave`,
    DELETE: (id: number) => `/minyan/${id}`,
  },
  // Add more endpoints as needed
} as const;
