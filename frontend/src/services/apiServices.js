import api from "../api/axios";

// Dashboard
export const fetchDashboardData = () => {
  return api.get("/dashboard/data/");
};

// Medicines
export const fetchMedicinesList = () => {
  return api.get("/medicines/list/");
};

export const fetchMedicines = fetchMedicinesList;

export const createMedicine = (data) => {
  return api.post("/medicines/create/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateMedicine = (id, data) => {
  return api.put(`/medicines/update/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteMedicine = (id) => {
  return api.delete(`/medicines/delete/${id}/`);
};

export const fetchLowStockMedicines = () => {
  return api.get("/medicines/low-stock/");
};

export const fetchMedicineAnalytics = () => {
  return api.get("/medicines/analytics/");
};

// Orders
export const placeOrder = (data) => {
  return api.post("/orders/place/", data);
};

export const fetchOrderHistory = () => {
  return api.get("/orders/history/");
};

export const fetchOrderStatus = (id) => {
  return api.get(`/orders/status/${id}/`);
};

export const cancelOrder = (id) => {
  return api.put(`/orders/cancel/${id}/`);
};

export const fetchSupplierOrders = () => {
  return api.get("/orders/supplier-orders/");
};

export const updateOrderStatus = (id, data) => {
  return api.put(`/orders/update-status/${id}/`, data);
};

export const fetchAdminOrders = () => {
  return api.get("/orders/admin-orders/");
};

// Cart
export const fetchCart = () => {
  return api.get("/orders/cart/");
};

export const addCartItem = (data) => {
  return api.post("/orders/cart/add/", data);
};

export const updateCartItem = (id, data) => {
  return api.put(`/orders/cart/update/${id}/`, data);
};

export const removeCartItem = (id) => {
  return api.delete(`/orders/cart/remove/${id}/`);
};

export const checkoutCart = () => {
  return api.post("/orders/cart/checkout/");
};

// Admin User Management
export const fetchPendingUsers = () => {
  return api.get("/accounts/pending-users/");
};

export const approveUser = (id) => {
  return api.put(`/accounts/approve-user/${id}/`);
};

export const rejectUser = (id) => {
  // Backend uses DELETE to reject (removes the user record)
  return api.delete(`/accounts/reject-user/${id}/`);
};

// Contact
export const createContactMessage = (data) => {
  return api.post("/contact/create/", data);
};

export const fetchContactMessages = () => {
  return api.get("/contact/messages/");
};

export const replyContactMessage = (id, data) => {
  return api.put(`/contact/reply/${id}/`, data);
};

export const resolveContactMessage = (id) => {
  return api.put(`/contact/resolve/${id}/`);
};

// Notifications
export const fetchNotifications = async () => {
  const response = await api.get(
    "/notifications/list/"
  );
  console.log(response);

  return response.data;
};

export const markNotificationRead = (id) => {
  return api.put(`/notifications/read/${id}/`);
};

// Auth
export const loginUser = (data) => {
  // POST /accounts/login/ — { email, password }
  // Returns: { access_token, refresh_token } OR { mfa_required: true, user_id }
  return api.post("/accounts/login/", data);
};

export const registerUser = (data) => {
  // POST /accounts/register/ — { username, email, password, phone_number, role }
  return api.post("/accounts/register/", data);
};

// MFA Setup (for logged-in users — requires Bearer token)
export const setupMFA = () => {
  // POST /accounts/setup-mfa/ — returns { qr_code: "data:image/png;base64,..." }
  return api.post("/accounts/setup-mfa/");
};

export const verifyMFASetup = (otp) => {
  // POST /accounts/verify-mfa/ — { otp } — enables MFA on the account
  return api.post("/accounts/verify-mfa/", { otp });
};

// MFA Login Verification (no token required — uses user_id from login response)
export const verifyLoginMFA = (data) => {
  // POST /accounts/verify-login-mfa/ — { user_id, otp }
  // Returns: { access_token, refresh_token }
  return api.post("/accounts/verify-login-mfa/", data);
};

// Aliases
export const fetchBuyerOrders = fetchOrderHistory;
