import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/tailwind.css";
import "./index.css";
import "./services/errorLoggingService"; // Import for side effects
import "./services/apiDebugger"; // Import for side effects
import { initializeAxios } from "./services/authService"; // Import auth service initialization

// Initialize axios with authentication interceptors
initializeAxios();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
