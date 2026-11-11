
import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";

import type { BlogArticle } from "@/components/public/blog/blog-card/blog-card";

interface PopularArticlesProps {
  articles: BlogArticle[];
}

export default function PopularArticles({
  articles,
}: PopularArticlesProps) {
  return (
    <section className="container-width py-14 md:py-20">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#777783]">
            <TrendingUp size={16} />
            Recently published
          </div>

          <h2 className="editorial-heading text-3xl font-semibold text-[#24264A] md:text-4xl">
            Popular this week
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-7 text-[#777783]">
            Discover the latest stories published on The Open Tab.
          </p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#24264A] transition hover:gap-3"
        >
          Explore all articles
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E9E7E1] bg-white">
        {articles.length > 0 ? (
          articles.slice(0, 5).map((article, index) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group flex flex-col gap-4 border-b border-[#F0EEE9] p-5 transition last:border-b-0 hover:bg-[#FAF9F7] sm:flex-row sm:items-center sm:p-7"
            >
              <div className="flex items-center gap-5 sm:w-20">
                <span className="editorial-heading text-3xl font-semibold text-[#D8D6E0] transition group-hover:text-[#24264A]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#888795]">
                  {article.category}
                </p>

                <h3 className="editorial-heading text-xl font-semibold leading-snug text-[#24264A] transition group-hover:text-[#555780] md:text-2xl">
                  {article.title}
                </h3>

                <p className="mt-2 text-xs text-[#9998A0]">
                  {article.readTime}
                </p>
              </div>

              <div className="flex items-center justify-end">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E9E7E1] text-[#24264A] transition group-hover:border-[#24264A] group-hover:bg-[#24264A] group-hover:text-white">
                  <ArrowUpRight size={17} />
                </span>
              </div>
            </Link>
          ))
        ) : (
          <p className="p-8 text-center text-sm text-[#777783]">
            No published articles yet.
          </p>
        )}
      </div>
    </section>
  );
}
