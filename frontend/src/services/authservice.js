import api from "../api/axios";

export const registerUser = (data) => {
  return api.post("/accounts/register/", data);
};

export const loginUser = (data) => {
  return api.post("/accounts/login/", data);
};

export const setupMFA = () => {
  return api.post("/accounts/setup-mfa/");
};

export const verifyMFA = (otp) => {
  return api.post("/accounts/verify-mfa/", { otp });
};

export const verifyLoginMFA = (data) => {
  return api.post("/accounts/verify-login-mfa/", data);
};

export const refreshToken = (refreshToken) => {
  return api.post("/accounts/token/refresh/", { refresh: refreshToken });
};

export const fetchProfile = () => {
  return api.get("/accounts/profile/");
};

export const updateProfile = (data) => {
  return api.patch("/accounts/profile/", data);
};
