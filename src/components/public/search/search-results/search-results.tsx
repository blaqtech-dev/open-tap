
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Search,
  X,
  FileText,
} from "lucide-react";

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

interface SearchResultsProps {
  articles: SearchArticle[];
  categories: SearchCategory[];
}

export default function SearchResults({
  articles,
  categories,
}: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" ||
        article.category === activeCategory;

      const searchableText = [
        article.title,
        article.excerpt,
        article.category,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [articles, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* SEARCH HERO */}

      <section className="border-b border-[#E9E7E1]">
        <div className="container-width py-16 md:py-24">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#777783]">
            Explore The Open Tab
          </p>

          <h1 className="editorial-heading max-w-3xl text-4xl font-semibold leading-tight text-[#24264A] md:text-6xl">
            Find ideas worth
            <span className="block text-[#777783]">
              exploring.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#777783]">
            Search through articles, insights, stories, and
            perspectives covering technology, business,
            creativity, and more.
          </p>

          {/* SEARCH INPUT */}

          <div className="mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-[#E9E7E1] bg-white px-5 py-4 shadow-sm transition focus-within:border-[#24264A]">
            <Search size={21} className="shrink-0 text-[#777783]" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search articles, topics or keywords..."
              className="w-full bg-transparent text-sm text-[#24264A] outline-none placeholder:text-[#A2A1AA]"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="text-[#777783] transition hover:text-[#24264A]"
              >
                <X size={19} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS */}

      <section className="container-width py-14 md:py-20">
        {/* CATEGORIES */}

        <div className="mb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#777783]">
            Browse by category
          </p>

          <div className="flex flex-wrap gap-2">
            {["All", ...categories.map((category) => category.name)].map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2.5 text-xs font-medium transition ${
                    activeCategory === category
                      ? "border-[#24264A] bg-[#24264A] text-white"
                      : "border-[#E2DFD8] bg-white text-[#777783] hover:border-[#24264A] hover:text-[#24264A]"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {/* RESULTS HEADING */}

        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-[#E9E7E1] pb-5">
          <div>
            <h2 className="editorial-heading text-2xl font-semibold text-[#24264A]">
              {searchQuery.trim() ? "Search results" : "Explore articles"}
            </h2>

            <p className="mt-2 text-sm text-[#777783]">
              {filteredArticles.length}{" "}
              {filteredArticles.length === 1 ? "article" : "articles"} found
            </p>
          </div>

          {(searchQuery || activeCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="text-xs font-semibold text-[#24264A] underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ARTICLES */}

        {filteredArticles.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group rounded-2xl border border-[#E9E7E1] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C9C7D5] hover:shadow-lg md:p-8"
              >
                <div className="mb-6 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#F0EFF5] px-3 py-1.5 text-[11px] font-semibold text-[#24264A]">
                    {article.category}
                  </span>

                  <FileText
                    size={19}
                    className="shrink-0 text-[#A2A1AA]"
                  />
                </div>

                <h3 className="editorial-heading max-w-lg text-2xl font-semibold leading-snug text-[#24264A] transition group-hover:text-[#555780]">
                  {article.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#777783]">
                  {article.excerpt}
                </p>

                <div className="mt-7 flex items-center justify-between border-t border-[#F0EEE9] pt-5">
                  <span className="text-xs text-[#9998A0]">
                    {article.date}
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
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D9D6CF] bg-white px-6 py-16 text-center">
            <Search
              size={32}
              className="mx-auto mb-5 text-[#A2A1AA]"
            />

            <h3 className="editorial-heading text-2xl font-semibold text-[#24264A]">
              No articles found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#777783]">
              We couldn't find anything matching your search.
              Try another keyword or choose a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 rounded-full bg-[#24264A] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#393B65]"
            >
              Reset search
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
