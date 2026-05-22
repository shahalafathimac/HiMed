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

export const verifyLoginMFA = (userId, otp) => {
  return api.post("/accounts/verify-login-mfa/", {
    user_id: userId,
    otp,
  });
};