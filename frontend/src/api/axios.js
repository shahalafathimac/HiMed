import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import { refreshToken } from "../services/authservice";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    if (state.accessToken) {
      config.headers.Authorization = `Bearer ${state.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If token expired and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const state = useAuthStore.getState();
        
        // If we have a refresh token, try to refresh
        if (state.refreshToken) {
          const { data } = await refreshToken(state.refreshToken);
          
          // Update tokens in store
          useAuthStore.getState().setAuth(
            state.user,
            data.access_token,
            data.refresh_token
          );
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout and redirect to login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;