import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acceso desde celular
    proxy: {
      "/api": {
        target: "http://192.168.1.2:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
