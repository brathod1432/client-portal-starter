import type { MetadataRoute } from "next";

/**
 * robots directives. The authenticated portal should not be indexed; only
 * public marketing/auth entry points would be. Adjust for your deployment and
 * set NEXT_PUBLIC_APP_URL for an absolute sitemap/host.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/login", "/register", "/forgot-password"],
        disallow: [
          "/dashboard",
          "/projects",
          "/tickets",
          "/documents",
          "/invoices",
          "/messages",
          "/notifications",
          "/profile",
          "/settings",
          "/activity-log",
        ],
      },
    ],
    host: base,
  };
}
