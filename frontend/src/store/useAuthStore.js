import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      // MFA login flow variables
      mfaRequired: false,
      mfaUserId: null,
      
      // Temporary tokens for the mandatory MFA setup flow
      tempTokens: null,

      setAuth: (user, accessToken, refreshToken) => set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        mfaRequired: false,
        mfaUserId: null,
        tempTokens: null,
      }),

      setMfaRequired: (userId) => set({
        mfaRequired: true,
        mfaUserId: userId,
        isAuthenticated: false,
      }),
      
      setTempTokens: (user, accessToken, refreshToken) => set({
        tempTokens: { user, accessToken, refreshToken }
      }),

      clearTempTokens: () => set({
        tempTokens: null
      }),

      logout: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        mfaRequired: false,
        mfaUserId: null,
        tempTokens: null,
      }),

      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),
    }),
    {
      name: 'himed-auth-storage',
    }
  )
);

export default useAuthStore;
