import { create } from "zustand";
import { getCookie, setCookie, removeCookie } from "../utils/cookies";

const useAuthStore = create((set) => ({
  user: getCookie("user") ? JSON.parse(getCookie("user")) : null,
  accessToken: getCookie("access_token") || null,
  refreshToken: getCookie("refresh_token") || null,
  isAuthenticated: !!getCookie("access_token"),
  mfaRequired: false,
  mfaUserId: null,

  setAuth: (user, accessToken, refreshToken) => {
    setCookie("access_token", accessToken);
    setCookie("refresh_token", refreshToken);
    setCookie("user", JSON.stringify(user));

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      mfaRequired: false,
      mfaUserId: null,
    });
  },

  setMfaRequired: (userId) =>
    set({
      mfaRequired: true,
      mfaUserId: userId,
    }),

  logout: () => {
    removeCookie("access_token");
    removeCookie("refresh_token");
    removeCookie("user");

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      mfaRequired: false,
      mfaUserId: null,
    });
  },

  updateUser: (userData) =>
    set((state) => ({
      user: { ...state.user, ...userData },
    })),
}));

export default useAuthStore;
