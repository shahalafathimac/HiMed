import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import { refreshToken } from "../services/authservice";

const api = axios.create({
  baseURL: "",
  withCredentials: true,
});

const noAuthEndpoints = ["/login", "/register", "/token/refresh", "/verify-login-mfa"];

api.interceptors.request.use(
  (config) => {
    if (noAuthEndpoints.some((e) => config.url.includes(e))) {
      return config;
    }

    const state = useAuthStore.getState();
    if (state.accessToken) {
      config.headers.Authorization = `Bearer ${state.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = useAuthStore.getState();
        const { data } = await refreshToken(state.refreshToken);

        useAuthStore.getState().setAuth(
          useAuthStore.getState().user,
          data.access_token,
          data.refresh_token
        );

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
