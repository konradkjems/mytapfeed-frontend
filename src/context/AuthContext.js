import React, { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/user/profile`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                setError(null);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kunne ikke hente brugerdata');
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
                const response = await fetch(`${API_URL}/auth/status`, {
                    credentials: 'include'
                });
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
            const response = await fetch(`${API_URL}/auth/logout`, {
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
        logout
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