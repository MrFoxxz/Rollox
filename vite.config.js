import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 2020,
    strictPort: true,
    // `true` = acepta cualquier Host (túneles tunnelmole, ngrok, etc.). No uses la cadena "all", no es válida en Vite.
    allowedHosts: true,
  },
});
