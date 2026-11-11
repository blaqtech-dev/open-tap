
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

interface DatabaseCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface DatabaseArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  read_time_minutes: number;
  published_at: string | null;
  categories: { name: string } | { name: string }[] | null;
}

async function CategoryContent({
  params,
}: CategoryPageProps) {
  await connection();

  const { slug } = await params;

  const supabase = await createClient();

  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();

  if (categoryError) {
    throw new Error("Unable to load this category.");
  }

  if (!categoryData) {
    notFound();
  }

  const category = categoryData as DatabaseCategory;

  const { data: articleData, error: articleError } = await supabase
    .from("articles")
    .select(`
      id,
      slug,
      title,
      excerpt,
      read_time_minutes,
      published_at,
      categories(name)
    `)
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false });

  if (articleError) {
    throw new Error("Unable to load articles in this category.");
  }

  const categoryArticles = (articleData || []) as DatabaseArticle[];

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* CATEGORY HERO */}

      <section className="border-b border-[#E9E7E1]">
        <div className="container-width py-16 md:py-24">
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 text-xs font-semibold text-[#777783] transition hover:text-[#24264A]"
          >
            <span>←</span>
            Back to all articles
          </Link>

          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#777783]">
            Explore a topic
          </p>

          <h1 className="editorial-heading max-w-4xl text-4xl font-semibold leading-tight text-[#24264A] md:text-6xl">
            {category.name}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#777783]">
            {category.description ||
              `Discover articles, insights and perspectives about ${category.name.toLowerCase()}.`}
          </p>

          <div className="mt-8 flex items-center gap-2 text-sm text-[#777783]">
            <BookOpen size={17} />
            <span>
              {categoryArticles.length}{" "}
              {categoryArticles.length === 1 ? "article" : "articles"} in
              this category
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORY ARTICLES */}

      <section className="container-width py-14 md:py-20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="editorial-heading text-2xl font-semibold text-[#24264A] md:text-3xl">
            Latest in {category.name}
          </h2>
        </div>

        {categoryArticles.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {categoryArticles.map((article) => {
              const articleCategory = Array.isArray(article.categories)
                ? article.categories[0]?.name
                : article.categories?.name;

              const formattedDate = article.published_at
                ? new Intl.DateTimeFormat("en", {
                    month: "long",
                    year: "numeric",
                  }).format(new Date(article.published_at))
                : "";

              return (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group rounded-2xl border border-[#E9E7E1] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C9C7D5] hover:shadow-lg md:p-8"
                >
                  <span className="rounded-full bg-[#F0EFF5] px-3 py-1.5 text-[11px] font-semibold text-[#24264A]">
                    {articleCategory || category.name}
                  </span>

                  <h3 className="editorial-heading mt-7 text-2xl font-semibold leading-snug text-[#24264A] transition group-hover:text-[#555780]">
                    {article.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#777783]">
                    {article.excerpt}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-[#F0EEE9] pt-5">
                    <span className="text-xs text-[#9998A0]">
                      {formattedDate} · {article.read_time_minutes} min read
                    </span>

                    <span className="flex items-center gap-2 text-xs font-semibold text-[#24264A]">
                      Read article
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D9D6CF] bg-white px-6 py-16 text-center">
            <BookOpen
              size={32}
              className="mx-auto mb-5 text-[#A2A1AA]"
            />

            <h3 className="editorial-heading text-2xl font-semibold text-[#24264A]">
              No articles yet
            </h3>

            <p className="mt-3 text-sm text-[#777783]">
              New stories in this category are coming soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function CategoryPage({
  params,
}: CategoryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container-width min-h-[60vh] py-20">
          <div className="h-8 w-48 animate-pulse rounded bg-[#E9E5DC]" />
          <div className="mt-8 h-64 animate-pulse rounded-2xl bg-[#E9E5DC]" />
        </div>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}
