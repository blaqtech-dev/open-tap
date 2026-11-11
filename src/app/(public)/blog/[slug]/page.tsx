
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  Share2,
} from "lucide-react";
import { Suspense } from "react";

import ReadingProgress from "@/components/public/article/reading-progress/reading-progress";
import TableOfContents from "@/components/public/article/table-of-contents/table-of-contents";
import { createClient } from "@/lib/supabase/server";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

type ArticleSection = {
  heading?: string;
  paragraphs?: string[];
};

type CategoryRelation = {
  name: string;
};

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ArticleSection[];
  cover_image_url: string | null;
  author_name: string;
  read_time_minutes: number;
  published_at: string | null;
  category_id: string | null;
  categories: CategoryRelation | CategoryRelation[] | null;
};

type RelatedArticle = {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  categories: CategoryRelation | CategoryRelation[] | null;
};

function getCategoryName(
  category: CategoryRelation | CategoryRelation[] | null
) {
  if (Array.isArray(category)) {
    return category[0]?.name ?? "General";
  }

  return category?.name ?? "General";
}

function formatDate(date: string | null) {
  if (!date) return "Recently published";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

async function ArticleContent({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch the requested published article
  const { data: articleData, error: articleError } = await supabase
    .from("articles")
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      author_name,
      read_time_minutes,
      published_at,
      category_id,
      categories(name)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (articleError) {
    console.error("Article loading error:", articleError);
    throw new Error("Unable to load this article.");
  }

  if (!articleData) {
    notFound();
  }

const article = articleData as unknown as Article;

// Increment the article view count
const { error: viewError } = await supabase.rpc(
  "increment_article_view",
  {
    p_slug: slug,
  }
);

if (viewError) {
  console.error("Article view tracking error:", viewError);
}

const categoryName = getCategoryName(article.categories);

  const content = Array.isArray(article.content)
    ? article.content
    : [];

  const headings = content
    .map((section) => section.heading?.trim() ?? "")
    .filter(Boolean);

  // Fetch other published articles from the same category
  let relatedQuery = supabase
    .from("articles")
    .select(`
      id,
      title,
      slug,
      cover_image_url,
      categories(name)
    `)
    .eq("status", "published")
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(3);

  if (article.category_id) {
    relatedQuery = relatedQuery.eq(
      "category_id",
      article.category_id
    );
  }

  const { data: relatedData, error: relatedError } =
    await relatedQuery;

  if (relatedError) {
    console.error("Related articles error:", relatedError);
  }

  const relatedArticles =
    (relatedData ?? []) as unknown as RelatedArticle[];

  const shareUrl = `https://theopentab.com/blog/${article.slug}`;

  return (
    <article className="min-h-screen bg-[#f8f7f4]">
      <ReadingProgress />

      {/* Article header */}
      <header className="container-width max-w-5xl py-12 sm:py-16">
        <Link
          href="/blog"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#777783] transition-colors hover:text-[#24264a]"
        >
          <ArrowLeft size={17} />
          Back to articles
        </Link>

        <div className="mb-6">
          <span className="rounded-full bg-[#e9e5dc] px-4 py-2 text-xs font-semibold text-[#24264a]">
            {categoryName}
          </span>
        </div>

        <h1 className="editorial-heading max-w-4xl text-4xl font-bold leading-tight text-[#24264a] sm:text-5xl lg:text-6xl">
          {article.title}
        </h1>

        <p className="mt-7 max-w-3xl text-base leading-8 text-[#777783] sm:text-lg">
          {article.excerpt}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#e9e7e1] pt-6 text-sm text-[#777783]">
          <span className="font-semibold text-[#24264a]">
            {article.author_name}
          </span>

          <span>{formatDate(article.published_at)}</span>

          <span className="flex items-center gap-2">
            <Clock3 size={15} />
            {article.read_time_minutes} min read
          </span>
        </div>
      </header>

      {/* Cover image */}
      {article.cover_image_url && (
        <div className="container-width max-w-6xl">
          <div className="aspect-[16/9] overflow-hidden rounded-3xl bg-[#e9e5dc]">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article body */}
      <div className="container-width max-w-6xl py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
          <div className="min-w-0">
            <div className="mb-10 border-l-4 border-[#24264a] pl-5">
              <p className="text-sm leading-7 text-[#777783]">
                A perspective from The Open Tab — exploring ideas,
                developments and practical insights that matter.
              </p>
            </div>

            <div className="space-y-12">
              {content.map((section, index) => (
                <section key={index}>
                  {section.heading?.trim() && (
                    <h2
                      id={section.heading
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")}
                      className="editorial-heading mb-5 scroll-mt-24 text-2xl font-bold text-[#24264a] sm:text-3xl"
                    >
                      {section.heading}
                    </h2>
                  )}

                  <div className="space-y-5">
                    {(section.paragraphs ?? []).map(
                      (paragraph, paragraphIndex) => (
                        <p
                          key={paragraphIndex}
                          className="text-base leading-9 text-[#4f505b] sm:text-lg"
                        >
                          {paragraph}
                        </p>
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>

            {/* Share section */}
            <div className="mt-16 border-t border-[#e9e7e1] pt-8">
              <h3 className="editorial-heading text-xl font-bold text-[#24264a]">
                Enjoyed this story?
              </h3>

              <p className="mt-2 text-sm text-[#777783]">
                Share it with someone who might find it useful.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on Facebook"
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#24264a] transition-colors hover:bg-[#24264a] hover:text-white"
                >
                  <Share2 size={17} />
                  Facebook
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on LinkedIn"
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#24264a] transition-colors hover:bg-[#24264a] hover:text-white"
                >
                  <Share2 size={17} />
                  LinkedIn
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on X"
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#24264a] transition-colors hover:bg-[#24264a] hover:text-white"
                >
                  <Share2 size={17} />
                  X
                </a>
              </div>
            </div>
          </div>

          {/* Article sidebar */}
          <aside className="h-fit space-y-6 lg:sticky lg:top-8">
            {headings.length > 0 && (
              <TableOfContents headings={headings} />
            )}

            <div className="rounded-2xl border border-[#e9e7e1] bg-white p-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#777783]">
                ABOUT THE OPEN TAB
              </p>

              <h3 className="editorial-heading mt-4 text-2xl font-bold text-[#24264a]">
                Ideas worth exploring.
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#777783]">
                We explore technology, business, digital culture and ideas
                shaping the world around us.
              </p>

              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#24264a] hover:underline"
              >
                About our publication
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-[#e9e7e1] bg-white py-16 sm:py-20">
          <div className="container-width max-w-6xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#777783]">
              KEEP READING
            </p>

            <h2 className="editorial-heading text-3xl font-bold text-[#24264a]">
              Related stories
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#e9e7e1] bg-[#f8f7f4] transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#e9e5dc]">
                    {related.cover_image_url && (
                      <img
                        src={related.cover_image_url}
                        alt={related.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="p-5">
                    <span className="text-xs font-semibold text-[#777783]">
                      {getCategoryName(related.categories)}
                    </span>

                    <h3 className="editorial-heading mt-3 text-xl font-bold leading-snug text-[#24264a]">
                      {related.title}
                    </h3>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#24264a]">
                      Read story
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <Suspense
      fallback={
        <div className="container-width min-h-screen py-20 text-center text-[#777783]">
          Loading article...
        </div>
      }
    >
      <ArticleContent params={params} />
    </Suspense>
  );
}
