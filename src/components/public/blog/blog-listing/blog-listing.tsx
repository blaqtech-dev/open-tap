
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import BlogCard, {
  type BlogArticle,
} from "@/components/public/blog/blog-card/blog-card";

import BlogFilters from "@/components/public/blog/blog-filters/blog-filters";

import FeaturedArticle from "@/components/public/blog/featured-article/featured-article";

interface BlogListingProps {
  articles: BlogArticle[];
  categories: string[];
}

export default function BlogListing({
  articles,
  categories: articleCategories,
}: BlogListingProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...articleCategories];

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" ||
        article.category === activeCategory;

      const search = searchQuery.toLowerCase().trim();

      const matchesSearch =
        article.title.toLowerCase().includes(search) ||
        article.excerpt.toLowerCase().includes(search) ||
        article.category.toLowerCase().includes(search) ||
        article.author.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  const featuredArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <section className="border-b border-[#e9e7e1]">
        <div className="container-width py-16 sm:py-20 lg:py-24">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#777783]">
            <BookOpen size={17} />
            <span>THE OPEN TAB JOURNAL</span>
          </div>

          <h1 className="editorial-heading max-w-4xl text-4xl font-bold leading-tight text-[#24264a] sm:text-5xl lg:text-6xl">
            Explore ideas that
            <span className="text-[#777783]"> move you forward.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#777783] sm:text-lg">
            Discover thoughtful articles, practical resources and fresh
            perspectives on technology, business, creativity and everyday life.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[#777783]">
            <span>{articles.length} published stories</span>
            <span>Independent ideas. Fresh perspectives.</span>
          </div>
        </div>
      </section>

      <section className="container-width py-14 sm:py-16">
        <div className="mb-12">
          <BlogFilters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {featuredArticle && (
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="editorial-heading text-2xl font-bold text-[#24264a] sm:text-3xl">
                Featured Story
              </h2>

              <span className="text-xs font-semibold tracking-wider text-[#777783]">
                EDITOR'S PICK
              </span>
            </div>

            <FeaturedArticle article={featuredArticle} />
          </div>
        )}

        <div>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#777783]">
                KEEP EXPLORING
              </p>

              <h2 className="editorial-heading text-3xl font-bold text-[#24264a]">
                Latest Stories
              </h2>
            </div>

            <span className="text-sm text-[#777783]">
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1 ? "story" : "stories"} found
            </span>
          </div>

          {remainingArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {remainingArticles.map((article) => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>
          ) : featuredArticle ? (
            <div className="rounded-2xl border border-[#e9e7e1] bg-white px-6 py-10 text-center">
              <p className="text-sm text-[#777783]">
                That's the only story matching your search. Try another topic.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e9e7e1] bg-white px-6 py-14 text-center">
              <h3 className="editorial-heading text-2xl font-bold text-[#24264a]">
                No stories found
              </h3>

              <p className="mt-3 text-sm text-[#777783]">
                We couldn't find any articles matching your search.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-6 rounded-full bg-[#24264a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#393c70]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="container-width pb-16 sm:pb-20">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-[#24264a] p-8 text-white sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-white/60">
              STAY IN THE LOOP
            </p>

            <h2 className="editorial-heading text-3xl font-bold sm:text-4xl">
              Good ideas deserve your attention.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/70">
              Stay connected with fresh perspectives, useful discoveries and
              stories worth reading.
            </p>
          </div>

          <Link
            href="/about"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#24264a] transition-colors hover:bg-[#e9e5dc]"
          >
            Discover The Open Tab
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
