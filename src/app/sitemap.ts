
import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = 'https://opentap.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [
    { data: articles },
    { data: categories },
  ] = await Promise.all([
    supabase
      .from("articles")
      .select("slug, updated_at, published_at")
      .eq("status", "published"),

    supabase
      .from("categories")
      .select("slug"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = (articles ?? []).map(
    (article) => ({
      url: `${siteUrl}/blog/${article.slug}`,
      lastModified: article.updated_at
        ? new Date(article.updated_at)
        : article.published_at
          ? new Date(article.published_at)
          : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map(
    (category) => ({
      url: `${siteUrl}/category/${category.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  return [...staticPages, ...articlePages, ...categoryPages];
}
