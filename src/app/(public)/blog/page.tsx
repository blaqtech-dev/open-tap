
import { Suspense } from "react";
import { connection } from "next/server";

import { createClient } from "@/lib/supabase/server";

import BlogListing from "@/components/public/blog/blog-listing/blog-listing";

import type { BlogArticle } from "@/components/public/blog/blog-card/blog-card";

interface DatabaseArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  author_name: string;
  read_time_minutes: number;
  published_at: string | null;
  categories:
    | { name: string }
    | { name: string }[]
    | null;
}

async function BlogContent() {
  await connection();

  const supabase = await createClient();

  const [
    { data: articleData, error: articleError },
    { data: categoryData, error: categoryError },
  ] = await Promise.all([
    supabase
      .from("articles")
      .select(`
        id,
        slug,
        title,
        excerpt,
        cover_image_url,
        author_name,
        read_time_minutes,
        published_at,
        categories(name)
      `)
      .eq("status", "published")
      .order("published_at", { ascending: false }),

    supabase
      .from("categories")
      .select("name")
      .order("name", { ascending: true }),
  ]);

  if (articleError) {
    throw new Error("Unable to load published articles.");
  }

  if (categoryError) {
    throw new Error("Unable to load article categories.");
  }

  const articles: BlogArticle[] = (
    (articleData || []) as DatabaseArticle[]
  ).map((article) => {
    const category = Array.isArray(article.categories)
      ? article.categories[0]?.name
      : article.categories?.name;

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: category || "Uncategorized",
      image: article.cover_image_url || "",
      author: article.author_name,
      date: article.published_at
        ? new Intl.DateTimeFormat("en", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(article.published_at))
        : "",
      readTime: `${article.read_time_minutes} min read`,
    };
  });

  const categories = (categoryData || []).map(
    (category) => category.name
  );

  return (
    <BlogListing
      articles={articles}
      categories={categories}
    />
  );
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="container-width min-h-[60vh] py-20">
          <div className="animate-pulse">
            <div className="h-10 w-2/3 rounded-lg bg-[#e9e5dc]" />
            <div className="mt-5 h-5 w-1/2 rounded-lg bg-[#e9e5dc]" />
            <div className="mt-12 h-64 rounded-2xl bg-[#e9e5dc]" />
          </div>
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
}
