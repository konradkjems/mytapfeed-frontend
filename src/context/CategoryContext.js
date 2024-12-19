import React, { createContext, useState, useContext, useEffect } from 'react';
import API_URL from '../config';

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
                setError(null);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kunne ikke hente kategorier');
            }
        } catch (error) {
            console.error('Fejl ved hentning af kategorier:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const addCategory = async (categoryData) => {
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData)
            });
            if (response.ok) {
                const newCategory = await response.json();
                setCategories(prev => [...prev, newCategory]);
                return newCategory;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kunne ikke oprette kategori');
            }
        } catch (error) {
            console.error('Fejl ved oprettelse af kategori:', error);
            throw error;
        }
    };

    const updateCategory = async (categoryId, categoryData) => {
        try {
            const response = await fetch(`${API_URL}/categories/${categoryId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData)
            });
            if (response.ok) {
                const updatedCategory = await response.json();
                setCategories(prev => 
                    prev.map(cat => cat._id === categoryId ? updatedCategory : cat)
                );
                return updatedCategory;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kunne ikke opdatere kategori');
            }
        } catch (error) {
            console.error('Fejl ved opdatering af kategori:', error);
            throw error;
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`${API_URL}/categories/${categoryId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setCategories(prev => prev.filter(cat => cat._id !== categoryId));
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kunne ikke slette kategori');
            }
        } catch (error) {
            console.error('Fejl ved sletning af kategori:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const value = {
        categories,
        isLoading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory
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