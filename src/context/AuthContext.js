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
                return true;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kunne ikke hente brugerdata');
            }
        } catch (error) {
            console.error('Fejl ved hentning af brugerdata:', error);
            setError(error.message);
            setUserData(null);
            return false;
        }
    };

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/auth/status`, {
                credentials: 'include'
            });
            const data = await response.json();
            setIsAuthenticated(data.isAuthenticated);
            setUserData(data.user || null);
            return data.isAuthenticated;
        } catch (error) {
            console.error('Fejl ved tjek af auth status:', error);
            setIsAuthenticated(false);
            setUserData(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Fetch user data whenever authentication state changes
    useEffect(() => {
        if (isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated]);

    // Periodically check auth status and refresh user data
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            checkAuthStatus();
        }, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        userData,
        setUserData,
        fetchUserData,
        checkAuthStatus,
        error
    };

    if (isLoading) {
        return <div>Indlæser...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
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
