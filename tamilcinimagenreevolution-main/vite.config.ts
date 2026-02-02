import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id) return;
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor_recharts';
            if (id.includes('framer-motion')) return 'vendor_framer';
            if (id.includes('@tanstack')) return 'vendor_tanstack';
            if (id.includes('react-dom') || id.includes('react/')) return 'vendor_react';
            if (id.includes('lucide-react')) return 'vendor_icons';
            return 'vendor';
          }
        },
      },
    },
  },
}));
