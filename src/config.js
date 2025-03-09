const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://api.tapfeed.dk'
  : 'http://localhost:3000';

export default API_URL; 