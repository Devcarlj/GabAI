import axios from 'axios';

const axiosInstance = axios.create({
  // Default to relative /api so Vite dev proxy handles LAN access (e.g. 192.168.x.x:5173)
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // Crucial for reading and setting HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;