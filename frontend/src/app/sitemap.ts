import type { MetadataRoute } from "next";

const pages = ["", "/about", "/music", "/gallery", "/events", "/contact", "/shop"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];
  return pages.map((page) => ({
    url: new URL(page, siteUrl).toString(),
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : 0.7,
  }));
}
