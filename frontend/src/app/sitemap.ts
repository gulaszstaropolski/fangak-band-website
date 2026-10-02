import type { MetadataRoute } from "next";
import { getPageSlugs } from "@/lib/content";

const staticPages = ["", "/about", "/music", "/gallery", "/events", "/contact", "/shop"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];
  const pages = [...new Set([...staticPages, ...(await getPageSlugs()).map((slug) => `/${slug}`)])];
  return pages.map((page) => ({
    url: new URL(page, siteUrl).toString(),
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : 0.7,
  }));
}
