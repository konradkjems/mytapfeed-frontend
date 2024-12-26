import React, { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    const checkAuth = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/status`, {
                credentials: 'include'
            });
            
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error('Serveren returnerede ikke JSON data');
            }

            const data = await response.json();
            setIsAuthenticated(data.isAuthenticated);
            
            if (data.isAuthenticated) {
                await fetchUserData();
            }

            return data.isAuthenticated;
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            setError('Kunne ikke verificere login status');
            return false;
        }
    };

    const fetchUserData = async () => {
        try {
            console.log('Starter hentning af brugerdata');
            setIsLoading(true);
            const response = await fetch(`${API_URL}/api/user/profile`, {
                credentials: 'include'
            });
            
            console.log('Brugerdata response:', response);
            
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error('Serveren returnerede ikke JSON data');
            }

            if (response.ok) {
                const data = await response.json();
                console.log('Modtaget brugerdata:', data);
                setUserData(data);
                setError(null);
            } else {
                let errorMessage = 'Kunne ikke hente brugerdata';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    console.error('Kunne ikke parse fejlbesked:', e);
                }
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Fejl ved hentning af brugerdata:', error);
            setError(error.message);
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const checkAuthStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/api/auth/status`, {
                    credentials: 'include'
                });
                
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error('Serveren returnerede ikke JSON data');
                }

                const data = await response.json();
                
                if (isMounted) {
                    setIsAuthenticated(data.isAuthenticated);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                if (isMounted) {
                    setIsAuthenticated(false);
                    setError('Kunne ikke verificere login status');
                }
            }
        };

        checkAuthStatus();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadUserData = async () => {
            if (isAuthenticated) {
                try {
                    await fetchUserData();
                } catch (error) {
                    if (isMounted) {
                        console.error('Fejl ved indlæsning af brugerdata:', error);
                    }
                }
            } else {
                setUserData(null);
            }
            if (isMounted) {
                setIsLoading(false);
            }
        };

        loadUserData();

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated]);

    const logout = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                setIsAuthenticated(false);
                setUserData(null);
            } else {
                throw new Error('Kunne ikke logge ud');
            }
        } catch (error) {
            console.error('Fejl ved logout:', error);
            throw error;
        }
    };

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        userData,
        setUserData,
        fetchUserData,
        error,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 