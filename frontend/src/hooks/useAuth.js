import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  setupMFA,
  verifyLoginMFA,
  logoutUser,
  updateProfile,
} from "../services/authservice";
import useAuthStore from "../store/useAuthStore";

export const useAuth = () => {
  const { setAuth, setMfaRequired, logout, updateUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data, variables) => {
      if (data.data.mfa_required) {
        setMfaRequired(data.data.user_id);
      } else {
        setAuth(
          { username: variables.email.split("@")[0], email: variables.email },
          data.data.access_token,
          data.data.refresh_token
        );
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
  });

  const setupMFAMutation = useMutation({
    mutationFn: setupMFA,
  });

  const verifyLoginMFMutation = useMutation({
    mutationFn: ({ userId, otp }) => verifyLoginMFA({ user_id: userId, otp }),
    onSuccess: (data) => {
      setAuth(
        { username: "User" },
        data.data.access_token,
        data.data.refresh_token
      );
      setMfaRequired(null);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data, variables) => {
      updateUser(variables);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      window.location.href = "/login";
    },
  });

  return {
    ...useAuthStore.getState(),
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isSettingupMFA: setupMFAMutation.isPending,
    isVerifyingMFA: verifyLoginMFMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    setupMFA: setupMFAMutation.mutate,
    verifyLoginMFA: verifyLoginMFMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
  };
};

export default useAuth;
