
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  TrendingUp,
  Sparkles,
  BookOpen,
} from "lucide-react";

import Newsletter from "@/components/public/newsletter/newsletter";
import PopularArticles from "@/components/public/popular-articles/popular-articles";
import TrendingArticles from "@/components/public/trending-articles/trending-articles";
import { createClient } from "@/lib/supabase/server";
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
  categories: { name: string } | { name: string }[] | null;
}

interface DatabaseCategory {
  name: string;
  slug: string;
}

async function HomeContent() {
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
      .select("name, slug")
      .order("name", { ascending: true }),
  ]);

  if (articleError) {
    throw new Error("Unable to load homepage articles.");
  }

  if (categoryError) {
    throw new Error("Unable to load homepage categories.");
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

  const categories: DatabaseCategory[] = categoryData || [];

  const featuredArticle = articles[0];
  const latestArticles = articles.slice(0, 6);

  return (
    <div>
      {/* HERO SECTION */}

      <section className="container-width pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e3e1db] bg-white px-4 py-2 text-xs font-semibold text-[#62626d]">
            <Sparkles size={15} className="text-[#7778a9]" />
            A publication for curious minds
          </div>

          <h1 className="editorial-heading text-5xl font-medium leading-[1.12] tracking-tight text-[#24264a] sm:text-6xl md:text-7xl">
            Open your mind
            <br />
            to <span className="italic text-[#7778a9]">new ideas.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#777783] md:text-lg">
            Explore technology, artificial intelligence, business,
            productivity and ideas that inspire you to think differently.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-[#24264a] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#383b6a]"
            >
              Explore articles
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/about"
              className="rounded-full border border-[#deddd7] px-7 py-4 text-sm font-semibold text-[#24264a] transition hover:bg-white"
            >
              Discover our story
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}

      <section className="container-width pb-20">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7778a9]">
              Editor's selection
            </span>

            <h2 className="editorial-heading mt-2 text-3xl text-[#24264a] md:text-4xl">
              Worth your attention
            </h2>
          </div>

          <Link
            href="/blog"
            className="hidden items-center gap-2 text-sm font-semibold text-[#24264a] sm:flex"
          >
            View all <ArrowUpRight size={17} />
          </Link>
        </div>

        {featuredArticle ? (
          <Link
            href={`/blog/${featuredArticle.slug}`}
            className="group grid overflow-hidden rounded-3xl bg-[#24264a] md:grid-cols-2"
          >
            {featuredArticle.image ? (
              <div
                className="min-h-[300px] bg-cover bg-center transition duration-700 group-hover:scale-[1.02] md:min-h-[440px]"
                style={{
                  backgroundImage: `url("${featuredArticle.image}")`,
                }}
              />
            ) : (
              <div className="flex min-h-[300px] items-center justify-center bg-[#34365e] md:min-h-[440px]">
                <BookOpen size={60} className="text-white/40" />
              </div>
            )}

            <div className="flex flex-col justify-center p-8 text-white md:p-12">
              <span className="text-xs font-bold tracking-[0.18em] text-[#b8b8dc]">
                {featuredArticle.category}
              </span>

              <h3 className="editorial-heading mt-6 text-3xl leading-tight md:text-4xl">
                {featuredArticle.title}
              </h3>

              <p className="mt-5 text-sm leading-7 text-white/65">
                {featuredArticle.excerpt}
              </p>

              <div className="mt-8 flex items-center gap-2 text-sm text-white/65">
                <Clock3 size={16} />
                {featuredArticle.readTime}
              </div>

              <div className="mt-9 flex items-center gap-2 text-sm font-semibold">
                Read article
                <ArrowUpRight size={18} />
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-3xl bg-[#24264a] px-8 py-20 text-center text-white">
            <BookOpen size={40} className="mx-auto text-white/50" />

            <h3 className="editorial-heading mt-5 text-2xl">
              Your next great read starts here.
            </h3>

            <p className="mt-3 text-sm text-white/65">
              Published articles will appear here once they are available.
            </p>
          </div>
        )}
      </section>

      {/* POPULAR AND TRENDING ARTICLES */}

      <PopularArticles articles={articles} />
      <TrendingArticles articles={articles} />

      {/* CATEGORIES */}

      <section className="border-y border-[#e9e7e1] bg-white py-12">
        <div className="container-width">
          <div className="mb-7 flex items-center gap-2">
            <TrendingUp size={19} className="text-[#7778a9]" />

            <h2 className="text-sm font-bold text-[#24264a]">
              Explore topics
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="rounded-full border border-[#e9e7e1] bg-[#f8f7f4] px-5 py-3 text-sm font-medium text-[#555568] transition hover:border-[#24264a] hover:bg-[#24264a] hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST ARTICLES */}

      <section className="container-width py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7778a9]">
              Fresh perspectives
            </span>

            <h2 className="editorial-heading mt-2 text-3xl text-[#24264a] md:text-4xl">
              Latest stories
            </h2>

            <p className="mt-3 text-sm text-[#777783]">
              Discover ideas worth your time.
            </p>
          </div>

          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-semibold text-[#24264a]"
          >
            All stories <ArrowRight size={17} />
          </Link>
        </div>

        {latestArticles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {latestArticles.map((article) => (
              <article key={article.id}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="group block"
                >
                  {article.image ? (
                    <div
                      className="mb-5 aspect-[4/3] overflow-hidden rounded-2xl bg-cover bg-center transition duration-500 group-hover:opacity-85"
                      style={{
                        backgroundImage: `url("${article.image}")`,
                      }}
                    />
                  ) : (
                    <div className="mb-5 flex aspect-[4/3] items-center justify-center rounded-2xl bg-[#e9e5dc]">
                      <BookOpen size={42} className="text-[#7778a9]" />
                    </div>
                  )}

                  <span className="text-[10px] font-bold tracking-[0.16em] text-[#7778a9]">
                    {article.category}
                  </span>

                  <h3 className="editorial-heading mt-3 text-2xl leading-snug text-[#24264a] transition group-hover:text-[#7778a9]">
                    {article.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#777783]">
                    {article.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-xs text-[#858590]">
                    <span>{article.author}</span>

                    <span className="flex items-center gap-1">
                      <Clock3 size={13} />
                      {article.readTime}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#e9e7e1] bg-white px-6 py-16 text-center">
            <BookOpen size={35} className="mx-auto text-[#7778a9]" />

            <h3 className="editorial-heading mt-4 text-2xl text-[#24264a]">
              No stories published yet
            </h3>

            <p className="mt-3 text-sm text-[#777783]">
              New articles will appear here when they are published.
            </p>
          </div>
        )}
      </section>

      {/* NEWSLETTER */}

      <Newsletter />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="container-width min-h-[60vh] py-20">
          <div className="h-8 w-48 animate-pulse rounded bg-[#e9e5dc]" />
          <div className="mt-6 h-64 animate-pulse rounded-3xl bg-[#e9e5dc]" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
