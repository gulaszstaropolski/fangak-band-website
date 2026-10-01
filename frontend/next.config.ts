import type { NextConfig } from "next";

const cmsUrl = process.env.STRAPI_URL ? new URL(process.env.STRAPI_URL) : undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      ...(cmsUrl
        ? [{
          protocol: cmsUrl.protocol.replace(":", "") as "http" | "https",
          hostname: cmsUrl.hostname,
          port: cmsUrl.port || undefined,
          pathname: "/uploads/**",
        }]
        : []),
      { protocol: "https", hostname: "img.youtube.com", pathname: "/vi/**" },
    ],
  },
};

export default nextConfig;
