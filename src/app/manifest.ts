import type { MetadataRoute } from "next";

/**
 * Web app manifest — makes the portal installable ("Add to home screen") and
 * gives it a native-app feel on mobile. Swap icons/colors when white-labelling.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Client Portal Starter",
    short_name: "ClientPortal",
    description:
      "A secure, accessible client portal for projects, tickets, documents, invoices and messaging.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2f4bd6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
