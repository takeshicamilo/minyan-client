// Authentication related types based on the backend API

export interface User {
  id: number;
  email: string;
  phone: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
