
import Link from "next/link";
import { ArrowUpRight, Clock3,BookOpen } from "lucide-react";

export interface BlogArticle {
id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

interface BlogCardProps {
  article: BlogArticle;
}

export default function BlogCard({ article }: BlogCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e9e7e1] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#24264a]/5">
      {/* Article image */}
      <Link
        href={`/blog/${article.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[#e9e5dc]"
      >
       {article.image ? (
  <img
    src={article.image}
    alt={article.title}
    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
  />
) : (
  <div className="flex h-full w-full items-center justify-center bg-[#e9e5dc]">
    <BookOpen size={40} className="text-[#777783]" />
  </div>
)}

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#24264a] shadow-sm">
          {article.category}
        </span>
      </Link>

      {/* Article information */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2 text-xs text-[#777783]">
          <span>{article.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock3 size={13} />
            {article.readTime}
          </span>
        </div>

        <Link href={`/blog/${article.slug}`}>
          <h3 className="editorial-heading text-xl font-bold leading-snug text-[#24264a] transition-colors group-hover:text-[#5558a6] sm:text-2xl">
            {article.title}
          </h3>
        </Link>

        <p className="mt-3 flex-1 text-sm leading-7 text-[#777783]">
          {article.excerpt}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-[#e9e7e1] pt-4">
          <span className="text-sm font-medium text-[#24264a]">
            {article.author}
          </span>

          <Link
            href={`/blog/${article.slug}`}
            aria-label={`Read ${article.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8f7f4] text-[#24264a] transition-all duration-300 hover:bg-[#24264a] hover:text-white"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
