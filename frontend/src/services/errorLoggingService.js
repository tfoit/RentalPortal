import { API_URL } from "./config";
import axios from "axios";

/**
 * Service for logging frontend errors to the backend
 */
class ErrorLoggingService {
  constructor() {
    this.initialized = false;
    this.queue = [];
    this.API_URL = API_URL;
    this.endpoint = `${this.API_URL}/debug/frontend-error`;

    // Initialize error handlers
    this.init();
  }

  /**
   * Initialize error handlers
   */
  init() {
    if (this.initialized) return;

    // Set up global error handler
    window.addEventListener("error", (event) => {
      this.logError({
        type: "uncaught",
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error ? event.error.stack : null,
      });
    });

    // Set up unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      this.logError({
        type: "unhandledrejection",
        message: event.reason.message || String(event.reason),
        stack: event.reason.stack,
      });
    });

    // Patch console.error
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args);

      // Log to backend
      this.logError({
        type: "console.error",
        message: args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "),
      });
    };

    this.initialized = true;
  }

  /**
   * Log an error to the backend
   * @param {Object} errorData - Error data to log
   */
  logError(errorData) {
    try {
      // Add metadata
      const enhancedErrorData = {
        ...errorData,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      };

      // Try to get user info if available
      const token = localStorage.getItem("token");
      if (token) {
        enhancedErrorData.hasAuth = true;
      }

      // Queue the error for sending
      this.queue.push(enhancedErrorData);

      // Process queue
      this.processQueue();
    } catch (err) {
      // Don't use console.error here to avoid infinite loop
      console.warn("Error in error logger:", err);
    }
  }

  /**
   * Process the error queue
   */
  processQueue() {
    if (this.queue.length === 0) return;

    // Take the first error from the queue
    const errorData = this.queue.shift();

    // Send to backend
    axios
      .post(this.endpoint, errorData)
      .catch((err) => {
        // Don't use console.error here to avoid infinite loop
        console.warn("Failed to send error to backend:", err);
      })
      .finally(() => {
        // Process next error in queue if any
        if (this.queue.length > 0) {
          setTimeout(() => this.processQueue(), 1000);
        }
      });
  }

  /**
   * Manually log an error
   * @param {Error|string} error - Error object or message
   * @param {Object} additionalInfo - Additional information about the error
   */
  log(error, additionalInfo = {}) {
    let errorData = {
      type: "manual",
      ...additionalInfo,
    };

    if (error instanceof Error) {
      errorData.message = error.message;
      errorData.stack = error.stack;
      errorData.name = error.name;
    } else {
      errorData.message = String(error);
    }

    this.logError(errorData);
  }
}

// Create singleton instance
const errorLogger = new ErrorLoggingService();

export default errorLogger;
