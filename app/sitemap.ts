import { MetadataRoute } from "next";

const matchIds = [1193838, 1208021, 1535339]; 

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const baseUrl = "https://oddsmister.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/livescore`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
  ];

  const matchPages: MetadataRoute.Sitemap = matchIds.map((id) => ({
    url: `${baseUrl}/match/${id}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...matchPages];
}