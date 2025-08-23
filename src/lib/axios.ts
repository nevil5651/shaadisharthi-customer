import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  // This is the crucial part for httpOnly cookies.
  // It tells the browser to send cookies along with cross-origin requests.
  withCredentials: true,
});

// Response interceptor to handle common error cases, like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // The client cannot delete an httpOnly cookie. The server should have
        // invalidated it. We just need to redirect the user to the login page.
        // You might want to call a '/api/logout' endpoint here before redirecting.
        // Redirect to login and clear history
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
