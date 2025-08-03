import axios from 'axios';
const {VITE_API_URL} = import.meta.env;
const api = axios.create({
    baseURL: VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        "Content-Type": "application/json",
        }
        });
        export default api;