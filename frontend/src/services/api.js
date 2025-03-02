import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "/api", // This will proxy to http://localhost:5000 as configured in vite.config.js
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Optional: Redirect to login page
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post("/users/login", credentials),
  register: (userData) => api.post("/users/register", userData),
  getCurrentUser: () => api.get("/users/me"),
  updateProfile: (userData) => api.put("/users/profile", userData),
  forgotPassword: (email) => api.post("/users/forgot-password", { email }),
  resetPassword: (data) => api.post("/users/reset-password", data),
};

// Apartment API calls
export const apartmentAPI = {
  getAll: (params) => api.get("/apartments", { params }),
  getById: (id) => api.get(`/apartments/${id}`),
  create: (data) => api.post("/apartments", data),
  update: (id, data) => api.put(`/apartments/${id}`, data),
  delete: (id) => api.delete(`/apartments/${id}`),
};

// File API calls
export const fileAPI = {
  upload: (file, metadata) => {
    const formData = new FormData();
    formData.append("file", file);

    // Add any metadata if needed
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getFile: (fileId) => api.get(`/files/${fileId}`, { responseType: "blob" }),
  deleteFile: (fileId) => api.delete(`/files/${fileId}`),
};

// Contracts API calls
export const contractAPI = {
  getAll: () => api.get("/contracts"),
  getById: (id) => api.get(`/contracts/${id}`),
  create: (data) => api.post("/contracts", data),
  update: (id, data) => api.put(`/contracts/${id}`, data),
  delete: (id) => api.delete(`/contracts/${id}`),
  sign: (id, signature) => api.post(`/contracts/${id}/sign`, { signature }),
  download: (id) => api.get(`/contracts/${id}/download`, { responseType: "blob" }),
};

// Notifications API calls
export const notificationAPI = {
  getAll: () => api.get("/notifications"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export default api;
