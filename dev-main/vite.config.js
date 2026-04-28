import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,

    // ✅ ADD THIS
    allowedHosts: [
      "september-subsphenoid-celia.ngrok-free.dev",
      "carole-accommodative-rogelio.ngrok-free.dev",
      "endorsingly-portulacaceous-velva.ngrok-free.dev"
    ],

    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(new URL('.', import.meta.url).pathname, "./src"),
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("react-icons") || id.includes("lucide-react")) return "vendor-icons";
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("react-router")
          )
            return "vendor-react";
          // Let Rollup decide remaining vendor chunking to avoid circular manual chunk graphs.
          return;
        },
      },
    },
  },
}));
