# Vite Configuration Guide for React Projects

## 🚀 Basic Vite Configuration

### Minimal `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
```

## ⚡ Production-Ready Configuration

### Complete `vite.config.ts`

```typescript
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), "");

  const isProduction = command === "build";
  const isDevelopment = command === "serve";

  return {
    // Base public path when served in production or development
    base: env.VITE_BASE_PATH || "/",

    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
        // JSX runtime
        jsxRuntime: "automatic",
        // Babel configuration
        babel: {
          plugins: [
            // Add any Babel plugins here
            ["babel-plugin-styled-components", { displayName: true }],
          ],
        },
      }),

      // Bundle visualizer (only in production build analysis)
      isProduction &&
        visualizer({
          filename: "dist/stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),

    // Resolve configuration
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@stores": path.resolve(__dirname, "./src/stores"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@styles": path.resolve(__dirname, "./src/styles"),
      },
    },

    // CSS configuration
    css: {
      modules: {
        localsConvention: "camelCase",
        generateScopedName: isProduction
          ? "[hash:base64:8]"
          : "[name]__[local]--[hash:base64:5]",
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@styles/variables.scss";`,
        },
        less: {
          modifyVars: {
            // Ant Design or other Less variables
            "primary-color": "#1890ff",
          },
          javascriptEnabled: true,
        },
      },
    },

    // Server configuration
    server: {
      port: 3000,
      host: true, // Listen on all addresses
      open: true, // Automatically open browser
      cors: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/uploads": {
          target: env.VITE_UPLOADS_URL || "http://localhost:8080",
          changeOrigin: true,
        },
      },
      fs: {
        // Allow serving files from one level up
        allow: [".."],
      },
    },

    // Preview server (for production build preview)
    preview: {
      port: 4173,
      host: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },

    // Build configuration
    build: {
      outDir: "dist",
      sourcemap: isProduction ? "hidden" : true,
      minify: isProduction ? "esbuild" : false,
      target: "esnext",

      // Chunking strategy
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "ui-vendor": ["antd", "@chakra-ui/react"],
            "utils-vendor": ["lodash", "axios", "date-fns"],
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name.split(".")[1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return "assets/images/[name]-[hash][extname]";
            }
            if (/css/i.test(extType)) {
              return "assets/css/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
        },
      },

      // Bundle size warnings
      chunkSizeWarningLimit: 1000,
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        // Add other heavy dependencies that don't change often
      ],
      exclude: ["@vitejs/plugin-react"],
    },
  };
});
```

## 🔧 Advanced Configuration Options

### Multi-Environment Setup

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const configs = {
    development: {
      base: "/",
      build: { sourcemap: true },
    },
    staging: {
      base: "/staging/",
      build: { sourcemap: true },
    },
    production: {
      base: "/",
      build: { sourcemap: false },
    },
  };

  return {
    ...configs[mode as keyof typeof configs],
    // ... rest of configuration
  };
});
```

### PWA Configuration

```typescript
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "My React App",
        short_name: "ReactApp",
        description: "My Awesome React App",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
```

### Testing Configuration

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "**/*.d.ts", "**/*.config.*"],
    },
  },
});
```

## 📁 Environment Variables

### `.env` Files Structure

```bash
# .env
VITE_APP_TITLE=My React App
VITE_API_URL=http://localhost:8080

# .env.development
VITE_API_URL=http://localhost:8080
VITE_DEBUG=true

# .env.staging
VITE_API_URL=https://staging-api.example.com
VITE_DEBUG=false

# .env.production
VITE_API_URL=https://api.example.com
VITE_DEBUG=false
```

### Type Safety for Environment Variables

```typescript
// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_DEBUG: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 🔌 Useful Vite Plugins

### Essential Plugins Configuration

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),

    // TypeScript checker
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),

    // SVG support
    svgr({
      svgrOptions: {
        icon: true,
        // svgr options
      },
    }),
  ],
});
```

### Popular Plugin Imports

```typescript
import type { UserConfig } from "vite";

// Common plugins you might need:
import legacy from "@vitejs/plugin-legacy"; // Browser support
import compress from "vite-plugin-compression"; // Gzip/Brotli
import inspect from "vite-plugin-inspect"; // Debug
import html from "vite-plugin-html"; // HTML manipulation
import mkcert from "vite-plugin-mkcert"; // HTTPS certificates
```

## 🛠 Development Tools

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:staging": "tsc && vite build --mode staging",
    "build:production": "tsc && vite build --mode production",
    "preview": "vite preview",
    "preview:production": "vite preview --mode production",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🚀 Performance Optimizations

### Bundle Analysis Setup

```typescript
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    visualizer({
      filename: "dist/bundle-analysis.html",
      template: "treemap", // sunburst, treemap, network
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor";
            if (id.includes("lodash")) return "utils-vendor";
            return "vendor";
          }
        },
      },
    },
  },
});
```

### Dependency Pre-bundling

```typescript
export default defineConfig({
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "axios",
      "date-fns",
      "lodash-es",
    ],
    exclude: ["@vitejs/plugin-react"],
  },
});
```

## 🔒 Security Configuration

### CSP and Security Headers

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    headers: {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
    },
  },

  build: {
    rollupOptions: {
      plugins: [
        // Add security plugins here
      ],
    },
  },
});
```

## 📦 Deployment Configurations

### Different Deployment Targets

```typescript
// For GitHub Pages
base: '/repository-name/',

// For Netlify
// netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

// For Vercel
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This Vite configuration provides a solid foundation for React projects with production-ready optimizations, developer experience enhancements, and deployment flexibility.
