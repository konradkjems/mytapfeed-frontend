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
                    if (data.isAuthenticated) {
                        await fetchUserData();
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                if (isMounted) {
                    setIsAuthenticated(false);
                    setError('Kunne ikke verificere login status');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        checkAuthStatus();

        return () => {
            isMounted = false;
        };
    }, []);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        userData,
        setUserData,
        fetchUserData,
        error
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