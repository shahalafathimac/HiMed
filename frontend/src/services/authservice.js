import api from "../api/axios";

export const registerUser = (data) => {
  return api.post("/accounts/register/", data);
};

export const loginUser = (data) => {
  return api.post("/accounts/login/", data);
};

export const setupMFA = (token) => {
  return api.post(
    "/accounts/setup-mfa/",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verifyMFA = (otp, token) => {
  return api.post(
    "/accounts/verify-mfa/",
    { otp },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verifyLoginMFA = (data) => {
  return api.post(
    "/accounts/verify-login-mfa/",
    data
  );
};

export const refreshToken = (refreshToken) => {
  return api.post("/accounts/token/refresh/", {
    refresh: refreshToken,
  });
};