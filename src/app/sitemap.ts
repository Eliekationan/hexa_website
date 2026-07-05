import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getPublishedPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/contact", "/mentions-legales", "/blog"];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : route === "/blog" ? "daily" : "monthly",
    priority: route === "" ? 1 : route === "/blog" ? 0.8 : 0.6,
  }));

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    postEntries = posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    // Supabase non configuré ou table blog_posts absente : sitemap sans les articles.
  }

  return [...staticEntries, ...postEntries];
}
