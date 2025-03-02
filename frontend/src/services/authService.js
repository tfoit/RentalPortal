import axios from "axios";
import { API_URL, USERS_API_URL } from "./config";

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${USERS_API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Login user
export const login = async (username, password) => {
  try {
    console.log("Making login API call with:", { username });
    console.log("API endpoint:", `${USERS_API_URL}/login`);

    // Ensure we're sending the data in the format expected by the backend
    const credentials = { username, password };

    // Log the full request details (except password) for debugging
    console.log("Request details:", {
      url: `${USERS_API_URL}/login`,
      method: "POST",
      data: { username: credentials.username, password: "******" },
      headers: { "Content-Type": "application/json" },
    });

    const response = await axios.post(`${USERS_API_URL}/login`, credentials);

    console.log("Login API response:", response.data);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);

      // Create a user object with the data we have
      const userData = {
        userId: response.data.userId,
        username: response.data.username || username,
        role: response.data.role || "user",
        // Add any other user data available in the response
      };

      localStorage.setItem("user", JSON.stringify(userData));

      // Set authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);

      // Throw the actual error message from the server if available
      if (error.response.data && error.response.data.message) {
        throw { message: error.response.data.message };
      }
    } else if (error.request) {
      console.error("Error request - no response received:", error.request);
      throw { message: "No response received from server. Please check your connection." };
    } else {
      console.error("Error message:", error.message);
      throw { message: error.message || "Login failed" };
    }

    // Default error
    throw { message: "Login failed. Please check your credentials." };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete axios.defaults.headers.common["Authorization"];
  return true;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    // If there's an error parsing the JSON, clear the invalid data
    console.error("Error parsing user data from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get auth header
export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// Set auth header for axios
export const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Configure axios to use token for all requests
export const initializeAxios = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Log response errors
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Error data:", error.response.data);
        console.log("Error status:", error.response.status);

        // If 401 Unauthorized, log the user out
        if (error.response.status === 401) {
          // Prevent redirect loops by checking current path
          if (window.location.pathname !== "/login") {
            logout();
            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error);
    }
  );
};
