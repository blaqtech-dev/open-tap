
import { Suspense } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import SearchResults from "@/components/public/search/search-results/search-results";

interface DatabaseArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  published_at: string | null;
  categories: { name: string } | { name: string }[] | null;
}

interface SearchArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
}

interface SearchCategory {
  name: string;
  slug: string;
}

async function SearchContent() {
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
        published_at,
        categories(name)
      `)
      .eq("status", "published")
      .order("published_at", { ascending: false }),

    supabase
      .from("categories")
      .select("name, slug")
      .order("name", { ascending: true }),
  ]);

  if (articleError) {
    throw new Error("Unable to load searchable articles.");
  }

  if (categoryError) {
    throw new Error("Unable to load search categories.");
  }

  const articles: SearchArticle[] = (
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
      date: article.published_at
        ? new Intl.DateTimeFormat("en", {
            month: "long",
            year: "numeric",
          }).format(new Date(article.published_at))
        : "",
    };
  });

  const categories: SearchCategory[] = categoryData || [];

  return (
    <SearchResults
      articles={articles}
      categories={categories}
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container-width min-h-[60vh] py-20">
          <div className="h-8 w-48 animate-pulse rounded bg-[#E9E5DC]" />
          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-[#E9E5DC]" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
