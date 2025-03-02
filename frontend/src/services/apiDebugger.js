import axios from "axios";
import { API_URL } from "./config";
import errorLogger from "./errorLoggingService";

/**
 * Utility for debugging API calls
 */
class ApiDebugger {
  constructor() {
    this.API_URL = API_URL;
    this.setupAxiosInterceptors();
  }

  /**
   * Set up Axios interceptors to log requests and responses
   */
  setupAxiosInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        // Add timestamp to track request duration
        config._requestTime = Date.now();

        // Log request in development
        if (process.env.NODE_ENV === "development") {
          console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error) => {
        // Log request error
        console.error("❌ API Request Error:", error);
        errorLogger.log(error, { type: "api_request_error" });
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => {
        // Calculate request duration
        const duration = Date.now() - response.config._requestTime;

        // Log response in development
        if (process.env.NODE_ENV === "development") {
          console.log(`✅ API Response (${duration}ms): ${response.config.method.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
          });
        }

        return response;
      },
      (error) => {
        // Calculate request duration if possible
        const duration = error.config?._requestTime ? Date.now() - error.config._requestTime : null;

        // Log error response
        console.error(`❌ API Error (${duration ? duration + "ms" : "unknown"}):`, {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });

        // Log to backend
        errorLogger.log(error, {
          type: "api_response_error",
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });

        return Promise.reject(error);
      }
    );
  }

  /**
   * Get recent API errors from the backend
   * @returns {Promise<Array>} Array of recent API errors
   */
  async getRecentErrors() {
    try {
      const response = await axios.get(`${this.API_URL}/debug/errors`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch API errors:", error);
      return { error: error.message };
    }
  }

  /**
   * Get recent logs from the backend
   * @returns {Promise<Array>} Array of recent logs
   */
  async getRecentLogs() {
    try {
      const response = await axios.get(`${this.API_URL}/debug/logs`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      return { error: error.message };
    }
  }
}

// Create singleton instance
const apiDebugger = new ApiDebugger();

export default apiDebugger;
