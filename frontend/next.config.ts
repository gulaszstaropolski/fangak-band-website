import type { NextConfig } from "next";

const strapiUrl =
  process.env.STRAPI_URL ??
  (process.env.NODE_ENV === "production" ? undefined : "http://localhost:1337");
const cmsUrl = strapiUrl ? new URL(strapiUrl) : undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      ...(cmsUrl
        ? [
            {
              protocol: cmsUrl.protocol.replace(":", "") as "http" | "https",
              hostname: cmsUrl.hostname,
              port: cmsUrl.port || undefined,
              pathname: "/uploads/**",
            },
          ]
        : []),
      { protocol: "https", hostname: "img.youtube.com", pathname: "/vi/**" },
    ],
  },
};

export default nextConfig;
