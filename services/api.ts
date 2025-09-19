import { API_CONFIG, API_ENDPOINTS, getApiBaseUrl } from '@/config/api';
import { ApiError, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth';
import {
    CreateMinyanRequest,
    CreateMinyanResponse,
    GetNearbyMinyanimRequest,
    MyMinyanimResponse,
    NearbyMinyanimResponse
} from '@/types/minyan';
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

  async logout(): Promise<{ message: string }> {
    const response = await this.api.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  }

  // Minyan endpoints
  async createMinyan(minyanData: CreateMinyanRequest): Promise<CreateMinyanResponse> {
    const response = await this.api.post<CreateMinyanResponse>(API_ENDPOINTS.MINYAN.CREATE, minyanData);
    return response.data;
  }

  async getNearbyMinyanim(params: GetNearbyMinyanimRequest): Promise<NearbyMinyanimResponse> {
    // Use different parameter names for the simple endpoint
    const queryParams = {
      lat: params.latitude,
      lng: params.longitude,
      r: params.radius,
    };
    const response = await this.api.get<NearbyMinyanimResponse>(API_ENDPOINTS.MINYAN.NEARBY, { params: queryParams });
    return response.data;
  }

  async getMyMinyanim(): Promise<MyMinyanimResponse> {
    const response = await this.api.get<MyMinyanimResponse>(API_ENDPOINTS.MINYAN.MY_MINYANIM);
    return response.data;
  }

  async joinMinyan(minyanId: number): Promise<{ message: string; participant: any }> {
    const response = await this.api.post<{ message: string; participant: any }>(API_ENDPOINTS.MINYAN.JOIN(minyanId));
    return response.data;
  }

  async leaveMinyan(minyanId: number): Promise<{ message: string }> {
    const response = await this.api.delete<{ message: string }>(API_ENDPOINTS.MINYAN.LEAVE(minyanId));
    return response.data;
  }

  async deleteMinyan(minyanId: number): Promise<{ message: string }> {
    const response = await this.api.delete<{ message: string }>(API_ENDPOINTS.MINYAN.DELETE(minyanId));
    return response.data;
  }

}

export const apiService = new ApiService();
