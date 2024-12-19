const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.tapfeed.dk'
    : 'http://localhost:3000';

const apiCall = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API kald fejlede:', error);
        return { 
            success: false, 
            error: error.message || 'Der opstod en fejl ved API kaldet' 
        };
    }
};

export { API_BASE_URL, apiCall }; 