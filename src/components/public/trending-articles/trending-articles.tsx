
import Link from "next/link";
import { ArrowUpRight, Flame } from "lucide-react";

import type { BlogArticle } from "@/components/public/blog/blog-card/blog-card";

interface TrendingArticlesProps {
  articles: BlogArticle[];
}

export default function TrendingArticles({
  articles,
}: TrendingArticlesProps) {
  return (
    <section className="container-width py-14 md:py-20">
      <div className="mb-9 flex items-center justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#777783]">
            <Flame size={16} />
            Fresh from the journal
          </div>

          <h2 className="editorial-heading text-3xl font-semibold text-[#24264A] md:text-4xl">
            Trending stories
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-7 text-[#777783]">
            Explore recently published conversations, discoveries and ideas.
          </p>
        </div>

        <Link
          href="/blog"
          className="hidden items-center gap-2 text-sm font-semibold text-[#24264A] transition hover:gap-3 sm:inline-flex"
        >
          All stories
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {articles.slice(0, 3).map((article, index) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="group relative flex min-h-[310px] flex-col justify-between overflow-hidden rounded-2xl border border-[#E9E7E1] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#C9C7D5] hover:shadow-lg"
          >
            <div className="absolute -right-5 -top-8 editorial-heading text-[130px] font-bold leading-none text-[#F5F4F1] transition group-hover:text-[#EFEDF5]">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full bg-[#F0EFF5] px-3 py-1.5 text-[11px] font-semibold text-[#24264A]">
                {article.category}
              </span>

              <Flame size={18} className="text-[#B56A4A]" />
            </div>

            <div className="relative z-10 mt-12">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#9998A0]">
                {article.readTime}
              </p>

              <h3 className="editorial-heading text-2xl font-semibold leading-snug text-[#24264A] transition group-hover:text-[#555780]">
                {article.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#777783]">
                {article.excerpt}
              </p>
            </div>

            <div className="relative z-10 mt-7 flex items-center justify-between border-t border-[#F0EEE9] pt-5">
              <span className="text-xs font-semibold text-[#24264A]">
                Explore story
              </span>

              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
