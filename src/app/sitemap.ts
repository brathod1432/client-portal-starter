import type { MetadataRoute } from "next";

/**
 * Sitemap for the public (unauthenticated) entry points only. The portal itself
 * is gated and excluded from indexing (see robots.ts). Set NEXT_PUBLIC_APP_URL
 * to your deployment origin.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const now = new Date();
  return ["/login", "/register", "/forgot-password"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/login" ? 0.8 : 0.5,
  }));
}
