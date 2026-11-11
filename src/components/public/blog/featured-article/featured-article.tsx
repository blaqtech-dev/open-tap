
import Link from "next/link";
import { ArrowUpRight, Clock3,BookOpen } from "lucide-react";
import type { BlogArticle } from "../blog-card/blog-card";

interface FeaturedArticleProps {
  article: BlogArticle;
}

export default function FeaturedArticle({
  article,
}: FeaturedArticleProps) {
  return (
    <article className="group grid overflow-hidden rounded-3xl bg-[#24264a] lg:grid-cols-2">
      {/* Image */}
      <Link
        href={`/blog/${article.slug}`}
        className="relative block min-h-[280px] overflow-hidden bg-[#34365c] lg:min-h-[480px]"
      >
      {article.image ? (
  <img
    src={article.image}
    alt={article.title}
    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
  />
) : (
  <div className="absolute inset-0 flex items-center justify-center bg-[#34365c]">
    <BookOpen size={48} className="text-white/50" />
  </div>
)}

        <div className="absolute inset-0 bg-gradient-to-t from-[#15162e]/50 via-transparent to-transparent" />
      </Link>

      {/* Content */}
      <div className="flex flex-col justify-center p-7 text-white sm:p-10 lg:p-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white">
            EDITOR'S PICK
          </span>

          <span className="text-xs text-white/60">
            {article.category}
          </span>
        </div>

        <h2 className="editorial-heading max-w-xl text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl">
          {article.title}
        </h2>

        <p className="mt-5 max-w-lg text-sm leading-8 text-white/70 sm:text-base">
          {article.excerpt}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-white/60">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.date}</span>

          <span className="flex items-center gap-1">
            <Clock3 size={13} />
            {article.readTime}
          </span>
        </div>

        <div className="mt-9">
          <Link
            href={`/blog/${article.slug}`}
            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#24264a] transition-all hover:bg-[#e9e5dc]"
          >
            Read Featured Story
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
