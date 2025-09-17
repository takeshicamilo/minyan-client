import { apiService } from '@/services/api';
import { StorageService } from '@/services/storage';
import { ApiError, AuthContextType, LoginRequest, RegisterRequest, User } from '@/types/auth';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!(user && token);

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const [storedToken, storedUser] = await Promise.all([
        StorageService.getToken(),
        StorageService.getUser(),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        
        // Verify token is still valid by making a profile request
        try {
          await apiService.getProfile();
        } catch (error) {
          // Token is invalid, clear auth data
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiService.login(credentials);
      
      // Save auth data
      await Promise.all([
        StorageService.saveToken(response.access_token),
        StorageService.saveUser(response.user),
      ]);

      setToken(response.access_token);
      setUser(response.user);
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      const apiError = error as ApiError;
      Alert.alert('Login Failed', apiError.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiService.register(userData);
      
      Alert.alert(
        'Registration Successful',
        response.message + '. Please log in with your credentials.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/login'),
          },
        ]
      );
    } catch (error) {
      const apiError = error as ApiError;
      Alert.alert('Registration Failed', apiError.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await clearAuthData();
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = async (): Promise<void> => {
    await StorageService.clearAuthData();
    setToken(null);
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
