import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  loginUser, 
  registerUser, 
  setupMFA, 
  verifyLoginMFA,
  fetchProfile,
  updateProfile
} from "../services/authservice";
import useAuthStore from "../store/useAuthStore";

export const useAuth = () => {
  const { setAuth, setMfaRequired, logout, updateUser } = useAuthStore();
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data, variables, context) => {
      if (data.data.mfa_required) {
        // MFA required, store the user_id from backend
        setMfaRequired(data.data.user_id);
      } else {
        // Login successful, set auth state
        setAuth(
          {
            username: variables.email.split("@")[0],
            email: variables.email,
          },
          data.data.access_token,
          data.data.refresh_token
        );
      }
    },
    onError: (error) => {
      throw new Error(error.response?.data?.message || error.message);
    }
  });
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // Registration successful, user will be redirected to login
    },
    onError: (error) => {
      throw new Error(error.response?.data?.message || error.message);
    }
  });
  
  // Setup MFA mutation
  const setupMFAMutation = useMutation({
    mutationFn: setupMFA,
    onSuccess: (data) => {
      // Returns QR code data for MFA setup
      return data.data.qr_code;
    },
    onError: (error) => {
      throw new Error(error.response?.data?.message || error.message);
    }
  });
  
  // Verify MFA (login) mutation
  const verifyLoginMFMutation = useMutation({
    mutationFn: ({ userId, otp }) => verifyLoginMFA(userId, otp),
    onSuccess: (data) => {
      setAuth(
        { username: "User" }, // Will be updated on dashboard load
        data.data.access_token,
        data.data.refresh_token
      );
      // Clear MFA state
      setMfaRequired(null);
    },
    onError: (error) => {
      throw new Error(error.response?.data?.message || error.message);
    }
  });
  
  // Fetch user profile
  const { data: profile = null, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!useAuthStore.getState().accessToken,
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data, variables) => {
      updateUser(variables);
    },
    onError: (error) => {
      throw new Error(error.response?.data?.message || error.message);
    }
  });
  
  return {
    // Auth state from store
    ...useAuthStore.getState(),
    
    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isSettingupMFA: setupMFAMutation.isPending,
    isVerifyingMFA: verifyLoginMFMutation.isPending,
    isFetchingProfile: profileLoading,
    isUpdatingProfile: updateProfileMutation.isPending,
    
    // Data
    profile,
    
    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    setupMFA: setupMFAMutation.mutate,
    verifyLoginMFA: verifyLoginMFMutation.mutate,
    logout: logout,
    updateProfile: updateProfileMutation.mutate,
  };
};

export default useAuth;