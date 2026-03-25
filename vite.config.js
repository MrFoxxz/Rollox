import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // 🔥 CLAVE → permite conexiones externas
    port: 2020, // asegúrate del puerto
    strictPort: true,
    allowedHosts: "all", // ya lo tienes bien
  },
});
