import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Deliberately NOT nonce-based. A strict CSP with per-request nonces forces
 * every page to render dynamically, which would cancel out the static
 * prerendering this app gets from `cacheComponents`. So this policy hardens
 * every directive that does not require a nonce, and `script-src` keeps
 * 'unsafe-inline' as the known tradeoff.
 *
 * If you would rather have the strict CSP, remove `cacheComponents` and switch
 * to the nonce approach in proxy.ts (see the Next.js CSP guide).
 */

// Supabase is the only third party: one origin for auth, database, and realtime.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const supabaseOrigin = supabaseUrl ?? "https://*.supabase.co";
const supabaseWs = supabaseUrl
  ? `${supabaseUrl.replace(/^https:/, "wss:")}`
  : "wss://*.supabase.co";

const csp = [
  "default-src 'self'",
  // Known tradeoff: inline scripts are allowed, so this does not stop a
  // same-origin injected <script>. It does stop external and injected
  // script *sources*, which is the realistic XSS vector for this app.
  `script-src 'self' 'unsafe-inline'${
    process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
  }`,
  // Styles: Tailwind injects styles at runtime, so inline is required.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "font-src 'self' data:",
  // Poker has no plugins, no media, and no third-party frames.
  "object-src 'none'",
  "media-src 'none'",
  // Blocks <base> hijacking and clickjacking.
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  `connect-src 'self' ${supabaseOrigin} ${supabaseWs}`,
  // No third-party frames at all.
  "frame-src 'none'",
  "upgrade-insecure-requests",
]
  .join("; ")
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;