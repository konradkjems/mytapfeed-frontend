const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://my.tapfeed.dk/api'
    : 'http://localhost:3000/api';

export default API_URL; 