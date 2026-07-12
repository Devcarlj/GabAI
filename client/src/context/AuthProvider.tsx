import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AuthContext, type UserProfile } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/auth/user-details');
      if (response.data?.success && response.data?.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      // 🟢 Handled: Logging the primary validation error
      console.warn("Primary access token validation failed. Initializing token rotation sequence...", error);
      
      try {
        const refreshResponse = await axiosInstance.post('/auth/refresh-token');
        if (refreshResponse.data?.success) {
          const retryDetails = await axiosInstance.get('/auth/user-details');
          if (retryDetails.data?.success) {
            setUser(retryDetails.data.data);
            return;
          }
        }
      } catch (refreshError) {
        // 🟢 Handled: Logging the token rotation failure
        console.error("Refresh token rotation sequence terminated or credentials absent:", refreshError);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error("System logging out execution error:", error);
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (isMounted) {
        await checkAuthStatus();
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      checkAuthStatus, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};