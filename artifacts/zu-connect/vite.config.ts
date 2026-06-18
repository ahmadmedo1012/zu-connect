import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: "es2020",
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress lottie-web eval() warning (unavoidable with this lib)
        if (warning.code === "EVAL" && warning.id && /lottie/.test(warning.id)) return;
        // Suppress sourcemap warnings for shadcn/ui .js stub files
        if (warning.code === "SOURCEMAP_ERROR" && warning.id && /node_modules\/@radix-ui/.test(warning.id)) return;
        warn(warning);
      },
      output: {
        manualChunks(id) {
          // Workspace packages — keep them as separate entries
          if (id.includes("@workspace/")) return "workspace";

          // Node_modules chunking
          if (id.includes("node_modules")) {
            if (id.includes("react") && !id.includes("lottie")) return "vendor-react";
            if (id.includes("framer-motion")) return "vendor-animation";
            if (id.includes("lucide-react")) return "vendor-icons";
            if (id.includes("@tanstack/react-query")) return "vendor-query";
            if (id.includes("@radix-ui/")) return "vendor-ui";
            if (id.includes("lottie-react") || id.includes("lottie-web")) return "vendor-lottie";
            return "vendor-other";
          }
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
    ],
    exclude: [
      '@workspace/api-client-react',
    ],
  },
});
