import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      accessToken: null,

      refreshToken: null,

      isAuthenticated: false,

      mfaRequired: false,

      mfaUserId: null,

      tempTokens: null,

      setMFARequired: (required, userId) =>
        set({
          mfaRequired: required,
          mfaUserId: userId,
        }),

      setTempTokens: (user, accessToken, refreshToken) =>
        set({
          tempTokens: { user, accessToken, refreshToken },
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      setAuth: (
        user,
        accessToken,
        refreshToken
      ) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          mfaRequired: false,
          mfaUserId: null,
          tempTokens: null,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          mfaRequired: false,
          mfaUserId: null,
          tempTokens: null,
        }),
    }),
    {
      name: "himed-auth-storage",
    }
  )
);

export default useAuthStore;