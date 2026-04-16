import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages (hourly update)
  const hourlyPages: MetadataRoute.Sitemap = [
    "",
    "home",
    "business",
    "sports",
    "tech",
    "entertainment",
    "africa",
    "world",
  ].map((path) => ({
    url: `https://www.theghanaianweb.com/${path}`,
    lastModified: now,
    changeFrequency: "hourly" as const, // ✅ fixed
    priority: 0.9,
  }));

  // Static pages (update every 2 days → "weekly" is closest sitemap option)
  const twoDayPages: MetadataRoute.Sitemap = [
    "features",
    "reviews",
    "music",
    "movie",
  ].map((path) => ({
    url: `https://www.theghanaianweb.com/${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const, // ✅ fixed
    priority: 0.7,
  }));

  // Dynamic article detail pages (for later DB/API fetch)
  const dynamicArticles: MetadataRoute.Sitemap = [];

  return [
    ...hourlyPages,
    ...twoDayPages,
    ...dynamicArticles,
  ];
}
