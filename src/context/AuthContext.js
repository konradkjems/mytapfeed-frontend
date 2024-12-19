import React, { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${API_URL}/user/profile`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        } catch (error) {
            console.error('Fejl ved hentning af brugerdata:', error);
        }
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/status`, {
                    credentials: 'include'
                });
                const data = await response.json();
                setIsAuthenticated(data.isAuthenticated);
                if (data.isAuthenticated) {
                    await fetchUserData();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        userData,
        setUserData,
        fetchUserData
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