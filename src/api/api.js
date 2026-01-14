import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  if (
    config.url.includes("/auth/login") ||
    config.url.includes("/auth/register") ||
    config.url.includes("/auth/refresh")
  ) {
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const RAW = axios.create({
          baseURL: "http://localhost:5000/api",
        });

const res = await RAW.post("/auth/refresh-token", { refreshToken });

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("token", newAccessToken);

        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;


export const loginUser = (data) => API.post("/auth/", data);
export const registerUser = (data) => API.post("/auth/register", data);

// ===========================================================
export const changePassword = (data) =>API.put("/change-password", data);

export const getAllProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);

export const addToCart = (data) => API.post("/cart", data);
export const getCart = () => API.get("/cart");

export const placeOrder = (data) => API.post("/orders", data);
export const getUserOrders = () => API.get("/orders");

export const getAIScanHistory = () =>API.get("/ai/history");
export const getNotifications = () => API.get("/notifications");
export const generateCareWithAI = (plantName) => API.get(`/ai/generate-care/${encodeURIComponent(plantName)}`);
// ===========================================================
// SETTINGS APIs
// ===========================================================
export const getSettings = () => API.get("/settings");
export const updateSettings = (data) => API.put("/settings", data);

export const getMyPlants = () => API.get("/user/my-plants");
export const ratePlant = (data) =>
  API.post("/user/rate-plant", data);
export const getFooterContent = () => API.get("/footer");

// ===========================================================
// SELLER APIs
// ===========================================================
export const applySeller = (data) => API.post("/seller/apply", data);
export const getSellerDashboard = () => API.get("/seller/dashboard");

export const getSellerPlants = () => API.get("/seller/plants");
export const createPlant = (data) => API.post("/seller/plants", data);
export const updatePlant = (id, data) => API.put(`/seller/plants/${id}`, data);
export const deletePlant = (id) => API.delete(`/seller/plants/${id}`);
export const getSellerPlantById = (id) =>  API.get(`/seller/plants/${id}`);
export const getProductAnalytics = () => API.get("/seller/analytics/products");
export const getSalesDashboard = () => API.get("/seller/salesanalytics/dashboard");

export const applyPromotion = (id, data) =>
  API.put(`/seller/plants/${id}/promotion`, data);
export const requestPayout = (data) =>API.post("/seller/payouts/request", data);

export const getSellerOrders = () =>
  API.get("/seller/orders");

export const updateOrderStatus = (orderId, data) =>
  API.put(`/seller/orders/${orderId}/status`, data);


export const getSellerNotifications = () => API.get("/seller/notifications");

export const getSellerProfile = () =>
  API.get("/seller/profile");

export const updateSellerProfile = (data) =>
  API.put("/seller/profile", data);
export const getFeaturedPlants = () => API.get("/plants/featured");
export const getOfferPlants = () => API.get("/plants/offers");
   

//admin
export const getAdminDashboard = () =>
  API.get("/admin/dashboard");

export const getAllUsers = () => API.get("/admin/users");

export const updateUser = (id, data) =>
  API.put(`/admin/users/${id}`, data);

export const addUser = (data) =>
  API.post("/admin/users", data);
export const getAdminOrders = (params) =>
  API.get("/admin/orders", { params });
export const getAdminProducts = () =>
  API.get("/admin/products");

export const deleteProduct = (id, data) =>
  API.delete(`/admin/products/${id}`, { data });
export const getDeletedPlants = () =>
  API.get("/admin/deleted-plants");

export const getCategories = () =>
  API.get("/categories");

export const refundOrder = (orderId) =>
  API.put(`/orders/${orderId}/refund`);


export const addCategory = (data) =>
  API.post("/admin/categories", data);

export const updateCategory = (id, data) =>
  API.put(`/admin/categories/${id}`, data);

export const deleteCategory = (id) =>
  API.delete(`/admin/categories/${id}`);

export const getAdminTips = () =>
  API.get("/admin/tips");

export const getDeletedTips = () =>
  API.get("/admin/tips/deleted");

export const deleteAdminTip = (id, data) =>
  API.delete(`/admin/tips/${id}`, { data });
// ADMIN – DISEASE REPORTS
export const getAdminDiseaseReports = () =>
  API.get("/admin/disease-reports");

export const deleteAdminDiseaseReport = (id) =>
  API.delete(`/admin/disease-reports/${id}`);
export const getAdminRevenue = () =>
  API.get("/admin/revenue");
export const markOrderAsPaid = (orderId) =>
  API.put(`/seller/orders/${orderId}/mark-paid`);
//chat
export const getSellers = () =>
  API.get("/chat/sellers");

export const getUsers = () =>
  API.get("/chat/users");

export const createConversation = (data) =>
  API.post("/chat/conversation", data);

export const getMyConversations = () =>
  API.get("/chat/conversation");

export const getMessages = (id) =>
  API.get(`/chat/message/${id}`);

export const sendMessage = (data) =>
  API.post("/chat/message", data);
export const markAsRead = (id) =>
  API.post(`/chat/read/${id}`);


