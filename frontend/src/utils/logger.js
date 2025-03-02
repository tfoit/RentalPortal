/**
 * Logger utility for the EuroRentals frontend application
 * Provides standardized logging with different levels and environment-aware behavior
 */

// Define log levels
const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Determine current environment to adjust logging behavior
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Set minimum log level based on environment
const MIN_LOG_LEVEL = isProduction ? LOG_LEVEL.WARN : LOG_LEVEL.DEBUG;

// Store logs in memory (limited count for performance)
const inMemoryLogs = [];
const MAX_MEMORY_LOGS = 1000;

// Format timestamp for logs
const formatTimestamp = () => {
  return new Date().toISOString();
};

// Core logging function
const logWithLevel = (level, message, data = {}) => {
  // Only log if level is greater than or equal to minimum log level
  if (level < MIN_LOG_LEVEL) return;

  const logEntry = {
    timestamp: formatTimestamp(),
    level: Object.keys(LOG_LEVEL).find((key) => LOG_LEVEL[key] === level),
    message,
    data,
  };

  // Store in memory for later retrieval (could be useful for sending logs to server)
  if (inMemoryLogs.length >= MAX_MEMORY_LOGS) {
    inMemoryLogs.shift(); // Remove oldest log
  }
  inMemoryLogs.push(logEntry);

  // Console output with appropriate styling
  const logStyles = {
    [LOG_LEVEL.DEBUG]: "color: #9e9e9e",
    [LOG_LEVEL.INFO]: "color: #2196f3",
    [LOG_LEVEL.WARN]: "color: #ff9800; font-weight: bold",
    [LOG_LEVEL.ERROR]: "color: #f44336; font-weight: bold",
  };

  const consoleLogFn = {
    [LOG_LEVEL.DEBUG]: console.debug,
    [LOG_LEVEL.INFO]: console.info,
    [LOG_LEVEL.WARN]: console.warn,
    [LOG_LEVEL.ERROR]: console.error,
  };

  // Use the appropriate console method
  if (isDevelopment) {
    consoleLogFn[level](`%c[${logEntry.level}] ${logEntry.timestamp}:`, logStyles[level], logEntry.message, logEntry.data);
  } else if (level >= LOG_LEVEL.WARN) {
    // In production, only output warnings and errors without styling
    consoleLogFn[level](`[${logEntry.level}]:`, logEntry.message, logEntry.data);
  }

  // If it's an error, we might want to send it to a monitoring service
  if (level === LOG_LEVEL.ERROR && isProduction) {
    // TODO: In a real app, you might send this to an error tracking service like Sentry
    // sendToErrorMonitoringService(logEntry);
  }

  return logEntry;
};

// Create logger object with methods for each log level
const logger = {
  debug: (message, data) => logWithLevel(LOG_LEVEL.DEBUG, message, data),
  info: (message, data) => logWithLevel(LOG_LEVEL.INFO, message, data),
  warn: (message, data) => logWithLevel(LOG_LEVEL.WARN, message, data),
  error: (message, data) => logWithLevel(LOG_LEVEL.ERROR, message, data),

  // Track user actions (convenience method)
  trackAction: (action, details) => {
    return logWithLevel(LOG_LEVEL.INFO, `User Action: ${action}`, details);
  },

  // Track API requests
  trackApi: (endpoint, method, data, result) => {
    return logWithLevel(LOG_LEVEL.DEBUG, `API ${method}: ${endpoint}`, {
      request: data,
      response: result,
    });
  },

  // Get all logs (for debugging or sending to server)
  getLogs: () => [...inMemoryLogs],

  // Clear logs from memory
  clearLogs: () => {
    inMemoryLogs.length = 0;
  },

  // Set custom minimum log level (for debugging)
  setMinLogLevel: (level) => {
    // Only allow in development
    if (isDevelopment) {
      MIN_LOG_LEVEL = level;
    }
  },
};

export default logger;
