import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API_URL from '../config';

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, checkAuthStatus } = useAuth();

    const fetchCategories = async () => {
        if (!isAuthenticated) {
            setCategories([]);
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/categories`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
                setError(null);
            } else if (response.status === 401) {
                // Hvis vi får en 401, prøv at tjekke auth status igen
                const isStillAuth = await checkAuthStatus();
                if (!isStillAuth) {
                    setCategories([]);
                    throw new Error('Din session er udløbet. Log venligst ind igen.');
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kunne ikke hente kategorier');
            }
        } catch (error) {
            console.error('Fejl ved hentning af kategorier:', error);
            setError(error.message);
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addCategory = async (categoryData) => {
        if (!isAuthenticated) {
            throw new Error('Du skal være logget ind for at oprette kategorier');
        }

        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData)
            });

            if (response.ok) {
                const newCategory = await response.json();
                setCategories(prev => [...prev, newCategory]);
                return newCategory;
            } else if (response.status === 401) {
                // Hvis vi får en 401, prøv at tjekke auth status igen
                const isStillAuth = await checkAuthStatus();
                if (!isStillAuth) {
                    throw new Error('Din session er udløbet. Log venligst ind igen.');
                }
            }
            const errorData = await response.json();
            throw new Error(errorData.message || 'Kunne ikke oprette kategori');
        } catch (error) {
            console.error('Fejl ved oprettelse af kategori:', error);
            throw error;
        }
    };

    // Genindlæs kategorier når auth status ændrer sig
    useEffect(() => {
        fetchCategories();
    }, [isAuthenticated]);

    const value = {
        categories,
        isLoading,
        error,
        fetchCategories,
        addCategory
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (context === null) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
}; 