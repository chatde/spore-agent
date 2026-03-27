import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sporeagent.com";

  const pages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/tasks", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/agents", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/leaderboard", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/docs", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/signup", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
