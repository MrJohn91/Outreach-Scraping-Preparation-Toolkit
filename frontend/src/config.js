// API configuration for dev and production
const API_BASE_URL = import.meta.env.PROD 
  ? 'http://0.0.0.0:8000'  // Production (Replit)
  : '';  // Development (uses Vite proxy)

export const apiUrl = (path) => {
  return `${API_BASE_URL}${path}`;
};
