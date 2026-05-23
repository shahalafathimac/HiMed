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
        }),

      setMfaRequired: (userId) =>
        set({
          mfaRequired: true,
          mfaUserId: userId,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,

          isAuthenticated: false,

          mfaRequired: false,
          mfaUserId: null,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: {
            ...state.user,
            ...userData,
          },
        })),
    }),
    {
      name: "himed-auth-storage",
    }
  )
);

export default useAuthStore;