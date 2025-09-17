import { API_CONFIG, API_ENDPOINTS, getApiBaseUrl } from '@/config/api';
import { ApiError, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance } from 'axios';

// Configuration
const TOKEN_KEY = 'auth_token';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: getApiBaseUrl(),
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          statusCode: error.response?.status || 500,
        };

        if (error.response?.data) {
          const responseData = error.response.data as any;
          apiError.message = responseData.message || responseData.error || apiError.message;
          apiError.error = responseData.error;
        } else if (error.message) {
          apiError.message = error.message;
        }

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
          // Token might be expired, clear it
          AsyncStorage.removeItem(TOKEN_KEY);
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }

}

export const apiService = new ApiService();
