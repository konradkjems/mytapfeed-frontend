import React, { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    const login = async (email, password, redirectUrl = null) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                setUserData(data.user);
                setAuthToken(data.token);

                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
                return true;
            } else {
                throw new Error('Login mislykkedes');
            }
        } catch (error) {
            console.error('Login fejl:', error);
            throw error;
        }
    };

    const checkAuth = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await fetch(`${API_URL}/api/auth/verify`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    setUserData(userData);
                    setAuthToken(token);
                    return true;
                } else {
                    logout();
                    return false;
                }
            } catch (error) {
                console.error('Auth verification error:', error);
                logout();
                return false;
            }
        }
        return false;
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

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth();
        };
        verifyAuth();
    }, []);

    useEffect(() => {
        const handlePendingActivation = () => {
            const pendingActivation = localStorage.getItem('pendingActivation');
            if (userData && pendingActivation) {
                // Naviger tilbage til aktiveringssiden
                window.location.href = `/activate/${pendingActivation}`;
            }
        };

        handlePendingActivation();
    }, [userData]);

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUserData(null);
        setAuthToken(null);
    };

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.status === 401) {
            logout();
            window.location.href = '/login';
            return;
        }

        return response;
    };

    const refreshToken = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                setAuthToken(data.token);
                return true;
            } else {
                logout();
                return false;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            logout();
            return false;
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            await refreshToken();
        }, 30 * 60 * 1000); // Hver 30 minutter

        return () => clearInterval(interval);
    }, []);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        userData,
        setUserData,
        fetchUserData,
        error,
        logout,
        checkAuth,
        login,
        authToken,
        setAuthToken,
        fetchWithAuth
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