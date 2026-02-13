// API configuration for dev and production
const API_BASE_URL = import.meta.env.PROD 
  ? ''  // Production (Vercel) - uses same domain
  : '';  // Development (uses Vite proxy)

export const apiUrl = (path) => {
  return `${API_BASE_URL}${path}`;
};
