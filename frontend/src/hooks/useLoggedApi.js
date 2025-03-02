import { useState, useCallback } from "react";
import axios from "axios";
import logger from "../utils/logger";

/**
 * Custom hook for making API calls with built-in logging
 * Tracks API request/response and timing information
 */
const useLoggedApi = () => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const [data, setData] = useState({});

  /**
   * Make a request to the API with logging
   * @param {Object} options - Request options
   * @param {string} options.url - API endpoint
   * @param {string} options.method - HTTP method (GET, POST, etc.)
   * @param {Object} options.data - Request payload
   * @param {Object} options.params - URL parameters
   * @param {Object} options.headers - Request headers
   * @param {string} options.requestId - Unique identifier for the request (optional)
   * @returns {Promise} - Promise that resolves with the response
   */
  const request = useCallback(async (options) => {
    const { url, method = "GET", data: requestData = null, params = null, headers = {}, requestId = `${method}-${url}-${Date.now()}` } = options;

    // Track start time for performance logging
    const startTime = performance.now();

    // Log the request
    logger.info(`API Request: ${method} ${url}`, {
      requestId,
      method,
      url,
      params,
      data: requestData,
    });

    setLoading((prev) => ({ ...prev, [requestId]: true }));
    setError((prev) => ({ ...prev, [requestId]: null }));

    try {
      const response = await axios({
        url,
        method,
        data: requestData,
        params,
        headers,
      });

      // Calculate request duration
      const duration = performance.now() - startTime;

      // Log successful response
      logger.info(`API Response: ${method} ${url} (${Math.round(duration)}ms)`, {
        requestId,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        duration,
      });

      setData((prev) => ({ ...prev, [requestId]: response.data }));
      setLoading((prev) => ({ ...prev, [requestId]: false }));
      return response.data;
    } catch (err) {
      // Calculate request duration
      const duration = performance.now() - startTime;

      // Log error response
      logger.error(`API Error: ${method} ${url} (${Math.round(duration)}ms)`, {
        requestId,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        duration,
      });

      setError((prev) => ({
        ...prev,
        [requestId]: {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        },
      }));
      setLoading((prev) => ({ ...prev, [requestId]: false }));
      throw err;
    }
  }, []);

  /**
   * Helper method for GET requests
   */
  const get = useCallback(
    (url, params, options = {}) => {
      return request({
        url,
        method: "GET",
        params,
        ...options,
        requestId: options.requestId || `GET-${url}-${Date.now()}`,
      });
    },
    [request]
  );

  /**
   * Helper method for POST requests
   */
  const post = useCallback(
    (url, data, options = {}) => {
      return request({
        url,
        method: "POST",
        data,
        ...options,
        requestId: options.requestId || `POST-${url}-${Date.now()}`,
      });
    },
    [request]
  );

  /**
   * Helper method for PUT requests
   */
  const put = useCallback(
    (url, data, options = {}) => {
      return request({
        url,
        method: "PUT",
        data,
        ...options,
        requestId: options.requestId || `PUT-${url}-${Date.now()}`,
      });
    },
    [request]
  );

  /**
   * Helper method for DELETE requests
   */
  const del = useCallback(
    (url, options = {}) => {
      return request({
        url,
        method: "DELETE",
        ...options,
        requestId: options.requestId || `DELETE-${url}-${Date.now()}`,
      });
    },
    [request]
  );

  return {
    loading,
    error,
    data,
    request,
    get,
    post,
    put,
    delete: del,
  };
};

export default useLoggedApi;
