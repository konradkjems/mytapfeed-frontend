import React, { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funktion til at gemme tokens
  const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  // Funktion til at slette tokens
  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  // Funktion til at forny access token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_URL}/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      saveTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      clearTokens();
      setUser(null);
      throw error;
    }
  };

  // Funktion til at hente brugerdata
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Prøv at forny token og hent data igen
          await refreshAccessToken();
          const newResponse = await fetch(`${API_URL}/user`, {
            credentials: 'include'
          });
          if (!newResponse.ok) {
            throw new Error('Failed to fetch user data after token refresh');
          }
          const data = await newResponse.json();
          setUser(data);
          return;
        }
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  // Check for eksisterende tokens ved opstart
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          await fetchUserData();
        } catch (error) {
          console.error('Error initializing auth:', error);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login funktion
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      saveTokens(data.accessToken, data.refreshToken);
      await fetchUserData();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout funktion
  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  // Automatisk token fornyelse hver 14. minut (tokens udløber efter 15 minutter)
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (user) {
        try {
          await refreshAccessToken();
        } catch (error) {
          console.error('Auto refresh token error:', error);
        }
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [user]);

  const value = {
    user,
    loading,
    login,
    logout,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 