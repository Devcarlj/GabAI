import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for reading and setting HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;