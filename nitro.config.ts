import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  srcDir: ".resux-nitro",
  compatibilityDate: "2026-05-02",
  cloudflare: {
    nodeCompat: true
  },
  // Resux uses top-level /plugins, /modules, and /middleware for app features.
  // Nitro auto-scans these folders too, so exclude them from Nitro scanning.
  ignore: ["plugins/**", "modules/**", "middleware/**", "assets/**"],
  // Keep Nitro discovery scoped to the generated adapter directory.
  scanDirs: ["."],
  publicAssets: [
    {
      dir: "../public",
      baseURL: "/"
    },
    {
      dir: "../.resux/client",
      baseURL: "/__resux",
      fallthrough: true
    }
  ],
  serverAssets: [
    {
      baseName: "resux",
      dir: "../.resux/server"
    }
  ],
  handlers: [
    {
      route: "/**",
      handler: "./.resux-nitro/handler.ts"
    }
  ],
  routeRules: {
    "/__resux/route": {
      headers: {
        "cache-control": "no-store"
      }
    },
    "/__resux/dev-events": {
      headers: {
        "cache-control": "no-store"
      }
    },
    "/__resux/chunks/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    "/__resux/assets/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    "/__resux/handlers/**": {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate"
      }
    },
    "/__resux/plugins/**": {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate"
      }
    },
    "/__resux/middleware/**": {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate"
      }
    },
    "/__resux/vue-islands/**": {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate"
      }
    },
    "/__resux/runtime-client.mjs": {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate"
      }
    },
    "/__resux/client-enhancements.mjs": {
      headers: {
        "cache-control": "public, max-age=0, must-revalidate"
      }
    },
    "/__resux/image": {
      headers: {
        "cache-control": "public, max-age=31536000, s-maxage=31536000, immutable"
      }
    },
    "/images/**": {
      headers: {
        "cache-control": "public, max-age=604800, stale-while-revalidate=86400"
      }
    },
    "/cv/**": {
      headers: {
        "cache-control": "public, max-age=604800, stale-while-revalidate=86400"
      }
    },
    "/api/**": {
      headers: {
        "cache-control": "no-store"
      }
    },
    "/**": {
      headers: {
        "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, must-revalidate"
      }
    }
  },
  prerender: {
    crawlLinks: false,
    routes: []
  }
});
