import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        // Don't rewrite the path - keep /api prefix for backend routes
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
