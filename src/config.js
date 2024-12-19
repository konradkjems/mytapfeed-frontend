const API_URL = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
        ? 'https://api.tapfeed.dk/api'
        : 'https://api.tapfeed.dk/api');

console.log('API URL:', {
    nodeEnv: process.env.NODE_ENV,
    apiUrl: API_URL
});

export default API_URL; 