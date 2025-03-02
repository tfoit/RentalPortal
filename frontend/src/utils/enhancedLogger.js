/**
 * Enhanced Logger for Debugging White Screen Issues
 * Provides detailed logging with visual formatting and advanced debugging features
 */

import React from "react";

// Configure log levels and their display properties
const LOG_LEVELS = {
  DEBUG: {
    value: 0,
    label: "DEBUG",
    style: "color: #6c757d; font-weight: normal;",
    consoleMethod: "debug",
  },
  INFO: {
    value: 1,
    label: "INFO",
    style: "color: #0dcaf0; font-weight: bold;",
    consoleMethod: "info",
  },
  WARN: {
    value: 2,
    label: "WARN",
    style: "color: #ffc107; font-weight: bold; background: #332701;",
    consoleMethod: "warn",
  },
  ERROR: {
    value: 3,
    label: "ERROR",
    style: "color: #dc3545; font-weight: bold; background: #290000;",
    consoleMethod: "error",
  },
  CRITICAL: {
    value: 4,
    label: "CRITICAL",
    style: "color: #fff; font-weight: bold; background: #dc3545;",
    consoleMethod: "error",
  },
};

// Default configuration
const DEFAULT_CONFIG = {
  level: LOG_LEVELS.DEBUG,
  includeTimestamp: true,
  includeCallStack: true,
  storeLogs: true,
  maxStoredLogs: 1000,
  consoleOutput: true,
  domOutput: true,
};

class EnhancedLogger {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.logs = [];
    this.startTime = performance.now();
    this.originalConsole = {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
      log: console.log,
      groupCollapsed: console.groupCollapsed,
      groupEnd: console.groupEnd,
    };
    this.setupDomLogger();

    // Intercept and log all console methods
    if (this.config.interceptConsole) {
      this.interceptConsole();
    }

    // Intercept all network requests
    if (this.config.interceptNetwork) {
      this.interceptNetworkRequests();
    }

    // Intercept all React errors
    if (this.config.interceptReactErrors) {
      this.interceptReactErrors();
    }

    // Log initial environment info
    this.logEnvironmentInfo();
  }

  /**
   * Set up DOM logger container for displaying logs in the page
   */
  setupDomLogger() {
    if (this.config.domOutput && typeof document !== "undefined") {
      this.logContainer = document.createElement("div");
      this.logContainer.id = "debug-log-container";
      Object.assign(this.logContainer.style, {
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        height: "200px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: "10000",
        overflowY: "auto",
        padding: "10px",
        display: "none", // Hidden by default
      });

      // Add toggle button
      const toggleButton = document.createElement("button");
      toggleButton.textContent = "Show Logs";
      Object.assign(toggleButton.style, {
        position: "fixed",
        bottom: "10px",
        right: "10px",
        zIndex: "10001",
        padding: "5px 10px",
        backgroundColor: "#0d6efd",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      });

      toggleButton.addEventListener("click", () => {
        if (this.logContainer.style.display === "none") {
          this.logContainer.style.display = "block";
          toggleButton.textContent = "Hide Logs";
        } else {
          this.logContainer.style.display = "none";
          toggleButton.textContent = "Show Logs";
        }
      });

      document.body.appendChild(this.logContainer);
      document.body.appendChild(toggleButton);
    }
  }

  /**
   * Intercept all console methods to log them
   */
  interceptConsole() {
    const self = this;

    Object.keys(LOG_LEVELS).forEach((level) => {
      const method = LOG_LEVELS[level].consoleMethod;
      console[method] = function (...args) {
        // Check if this is an internal call to avoid recursion
        if (args[0] === "___INTERNAL_LOG___") {
          // Remove the internal marker and pass to original console
          args.shift();
          self.originalConsole[method].apply(console, args);
          return;
        }

        self.log(level, ...args);
        // Use original method to avoid infinite recursion
        self.originalConsole[method].apply(console, args);
      };
    });
  }

  /**
   * Intercept all fetch and XMLHttpRequest calls
   */
  interceptNetworkRequests() {
    // Intercept fetch
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = function (...args) {
      const startTime = performance.now();
      const requestUrl = args[0].url || args[0];

      self.info(`📡 Fetch request: ${requestUrl}`, {
        method: args[1]?.method || "GET",
        body: args[1]?.body,
      });

      return originalFetch
        .apply(this, args)
        .then((response) => {
          const duration = performance.now() - startTime;
          self.info(`✅ Fetch response: ${requestUrl}`, {
            status: response.status,
            statusText: response.statusText,
            duration: `${duration.toFixed(2)}ms`,
          });
          return response;
        })
        .catch((error) => {
          const duration = performance.now() - startTime;
          self.error(`❌ Fetch error: ${requestUrl}`, {
            error: error.message,
            duration: `${duration.toFixed(2)}ms`,
          });
          throw error;
        });
    };

    // Intercept axios if available
    if (typeof window.axios !== "undefined") {
      const originalAxiosRequest = window.axios.request;

      window.axios.request = function (config) {
        const startTime = performance.now();

        self.info(`🔄 Axios request: ${config.url}`, {
          method: config.method || "GET",
          baseURL: config.baseURL,
          data: config.data,
          params: config.params,
        });

        return originalAxiosRequest
          .apply(this, [config])
          .then((response) => {
            const duration = performance.now() - startTime;
            self.info(`✅ Axios response: ${config.url}`, {
              status: response.status,
              statusText: response.statusText,
              duration: `${duration.toFixed(2)}ms`,
              data: response.data,
            });
            return response;
          })
          .catch((error) => {
            const duration = performance.now() - startTime;
            self.error(`❌ Axios error: ${config.url}`, {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              message: error.message,
              duration: `${duration.toFixed(2)}ms`,
            });
            throw error;
          });
      };
    }

    // Intercept XMLHttpRequest
    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (...args) {
      const startTime = performance.now();
      const method = args[0];
      const url = args[1];

      this.addEventListener("load", function () {
        const duration = performance.now() - startTime;
        self.info(`✅ XHR response: ${method} ${url}`, {
          status: this.status,
          statusText: this.statusText,
          duration: `${duration.toFixed(2)}ms`,
        });
      });

      this.addEventListener("error", function (error) {
        const duration = performance.now() - startTime;
        self.error(`❌ XHR error: ${method} ${url}`, {
          error: error,
          duration: `${duration.toFixed(2)}ms`,
        });
      });

      self.info(`📡 XHR request: ${method} ${url}`);
      return originalXHR.apply(this, args);
    };
  }

  /**
   * Intercept React errors
   */
  interceptReactErrors() {
    window.addEventListener("error", (event) => {
      this.critical("Uncaught error", {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error?.stack,
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.critical("Unhandled promise rejection", {
        reason: event.reason?.stack || event.reason || "Unknown reason",
      });
    });
  }

  /**
   * Log details about the current environment
   */
  logEnvironmentInfo() {
    try {
      // Use direct logging to avoid the enhanced logging during initialization
      const envInfo = {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        devicePixelRatio: window.devicePixelRatio,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };

      // Check if we're running in Vite's environment
      if (typeof import.meta !== "undefined" && import.meta.env) {
        envInfo.mode = import.meta.env.MODE;
        envInfo.isProduction = import.meta.env.PROD;
        envInfo.isDevelopment = import.meta.env.DEV;
      }

      // Skip the log method and use originalConsole directly to avoid recursion
      this.originalConsole.info.call(console, "___INTERNAL_LOG___", "🔍 Application environment", envInfo);

      // Store in logs array directly
      this.logs.push({
        timestamp: new Date().toISOString(),
        level: "INFO",
        message: "🔍 Application environment",
        data: envInfo,
      });

      // Log React version if available
      if (typeof React !== "undefined") {
        const reactInfo = {
          react: React?.version || "unknown",
          reactDOM: ReactDOM?.version || "unknown",
        };
        this.originalConsole.info.call(console, "___INTERNAL_LOG___", "📦 React version", reactInfo);
        this.logs.push({
          timestamp: new Date().toISOString(),
          level: "INFO",
          message: "📦 React version",
          data: reactInfo,
        });
      }
    } catch (err) {
      this.originalConsole.error.call(console, "___INTERNAL_LOG___", "Error logging environment info", err);
    }
  }

  /**
   * Format message with timestamp and level
   */
  formatMessage(level, message, data) {
    const levelInfo = LOG_LEVELS[level];
    const timestamp = this.config.includeTimestamp ? `[${(performance.now() - this.startTime).toFixed(2)}ms]` : "";
    const formattedMessage = `${timestamp} [${levelInfo.label}]: ${message}`;

    // For DOM output
    const domMessage = `${formattedMessage}${data ? " " + JSON.stringify(data, null, 2) : ""}`;

    // For console output with styling
    const consoleArgs = [`%c${formattedMessage}`, levelInfo.style];
    if (data) {
      consoleArgs.push(data);
    }

    return { domMessage, consoleArgs };
  }

  /**
   * Output to console with protection against recursion
   */
  consoleOutput(level, formattedMessage, data) {
    if (!this.config.consoleOutput || typeof console === "undefined") {
      return;
    }

    const method = LOG_LEVELS[level].consoleMethod;
    // Use original console with internal marker to prevent recursion
    this.originalConsole[method].apply(console, ["___INTERNAL_LOG___", formattedMessage, data]);
  }

  /**
   * Add a log entry
   */
  log(level, message, data = null) {
    // Check if we should log this level
    if (LOG_LEVELS[level].value < this.config.level.value) {
      return;
    }

    // Get call stack info if enabled
    let callStack = null;
    if (this.config.includeCallStack) {
      try {
        throw new Error();
      } catch (e) {
        callStack = e.stack
          .split("\n")
          .slice(2, 5) // Get only a few levels of the stack
          .join("\n");
      }
    }

    // Add entry to logs array
    if (this.config.storeLogs) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        data,
        callStack,
      };

      this.logs.push(logEntry);

      // Keep logs under the maximum limit
      if (this.logs.length > this.config.maxStoredLogs) {
        this.logs.shift();
      }
    }

    // Format log entry
    const { domMessage, consoleArgs } = this.formatMessage(level, message, data);

    // Output to console using our safe method
    this.consoleOutput(level, consoleArgs[0], data);

    // Show call stack for errors
    if (callStack && (level === "ERROR" || level === "CRITICAL")) {
      this.originalConsole.groupCollapsed.call(console, "___INTERNAL_LOG___", "Call Stack");
      this.originalConsole.log.call(console, "___INTERNAL_LOG___", callStack);
      this.originalConsole.groupEnd.call(console);
    }

    // Output to DOM
    if (this.config.domOutput && this.logContainer) {
      const logElement = document.createElement("div");
      logElement.className = `log-entry log-${level.toLowerCase()}`;
      logElement.innerHTML = domMessage.replace(/\n/g, "<br>");

      if (level === "ERROR" || level === "CRITICAL") {
        logElement.style.color = "#ff4d4d";
        logElement.style.fontWeight = "bold";
      }

      this.logContainer.appendChild(logElement);
      this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
  }

  /**
   * Log methods for different levels
   */
  debug(message, data) {
    this.log("DEBUG", message, data);
  }

  info(message, data) {
    this.log("INFO", message, data);
  }

  warn(message, data) {
    this.log("WARN", message, data);
  }

  error(message, data) {
    this.log("ERROR", message, data);
  }

  critical(message, data) {
    this.log("CRITICAL", message, data);
  }

  /**
   * Add a component render log
   */
  renderLog(componentName, props) {
    this.debug(`🔄 Rendering: ${componentName}`, props);
  }

  /**
   * Add a component mount log
   */
  mountLog(componentName) {
    this.debug(`⬆️ Mounted: ${componentName}`);
  }

  /**
   * Add a component unmount log
   */
  unmountLog(componentName) {
    this.debug(`⬇️ Unmounted: ${componentName}`);
  }

  /**
   * Add a component update log
   */
  updateLog(componentName, prevProps, nextProps) {
    this.debug(`📝 Updated: ${componentName}`, {
      prev: prevProps,
      next: nextProps,
    });
  }

  /**
   * Add a state change log
   */
  stateLog(componentName, stateName, oldValue, newValue) {
    this.debug(`🔄 State change in ${componentName}: ${stateName}`, {
      from: oldValue,
      to: newValue,
    });
  }

  /**
   * Create a higher-order component that logs lifecycle events
   */
  withLogging(Component) {
    const self = this;
    const componentName = Component.displayName || Component.name || "Component";

    return class LoggedComponent extends React.Component {
      render() {
        self.renderLog(componentName, this.props);
        return React.createElement(Component, this.props);
      }

      componentDidMount() {
        self.mountLog(componentName);
        if (super.componentDidMount) {
          super.componentDidMount();
        }
      }

      componentDidUpdate(prevProps, prevState) {
        self.updateLog(componentName, prevProps, this.props);
        if (super.componentDidUpdate) {
          super.componentDidUpdate(prevProps, prevState);
        }
      }

      componentWillUnmount() {
        self.unmountLog(componentName);
        if (super.componentWillUnmount) {
          super.componentWillUnmount();
        }
      }
    };
  }

  /**
   * Create a hook for logging state changes
   */
  useLoggedState(initialState, stateName, componentName = "Unknown") {
    if (typeof React === "undefined" || !React.useState) {
      console.error("React.useState is not available - logging hooks disabled");
      return [
        initialState,
        (newValue) => {
          initialState = newValue;
        },
      ];
    }

    const [state, setState] = React.useState(initialState);
    const self = this;

    const setLoggedState = (newValue) => {
      self.stateLog(componentName, stateName, state, newValue);
      setState(newValue);
    };

    return [state, setLoggedState];
  }

  /**
   * Export logs as JSON
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Clear all stored logs
   */
  clearLogs() {
    this.logs = [];
    if (this.logContainer) {
      this.logContainer.innerHTML = "";
    }
  }

  /**
   * Disable logging
   */
  disable() {
    this.config.level = { value: 100 }; // Setting higher than any level
  }

  /**
   * Enable logging
   */
  enable(level = "DEBUG") {
    this.config.level = LOG_LEVELS[level];
  }
}

// Create singleton instance with browser detection and error protection
let enhancedLogger;

try {
  enhancedLogger = new EnhancedLogger({
    interceptConsole: true,
    interceptNetwork: true,
    interceptReactErrors: true,
    domOutput: typeof document !== "undefined",
  });
} catch (error) {
  // Fallback logger in case the enhanced logger fails to initialize
  console.error("Failed to initialize enhanced logger:", error);

  enhancedLogger = {
    debug: console.debug.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    critical: console.error.bind(console),
    renderLog: () => {},
    mountLog: () => {},
    unmountLog: () => {},
    updateLog: () => {},
    stateLog: () => {},
    logs: [],
    clearLogs: () => {},
    exportLogs: () => JSON.stringify([]),
  };
}

export default enhancedLogger;
