const API_URL = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
        ? 'https://api.tapfeed.dk/api'
        : 'http://localhost:3000/api');

console.log('API URL:', {
    nodeEnv: process.env.NODE_ENV,
    apiUrl: API_URL
});

export default API_URL; 