
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  FileText,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type ArticleStatus = "All" | "Published" | "Draft";

type Article = {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  created_at: string;
  published_at: string | null;
  cover_image_url: string | null;
  views: number;
  categories:
    | { name: string }
    | { name: string }[]
    | null;
};

export default function ManageArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] =
    useState<ArticleStatus>("All");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch articles from Supabase
  const fetchArticles = useCallback(async () => {
    setLoading(true);

    const supabase = createClient();

  const { data, error } = await supabase
  .from("articles")
  .select(`
    id,
    title,
    slug,
    status,
    created_at,
    published_at,
    cover_image_url,
    views,
    categories (
      name
    )
  `)
  .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
      alert("Unable to load articles: " + error.message);
      setLoading(false);
      return;
    }

    setArticles((data ?? []) as Article[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const category = Array.isArray(article.categories)
        ? article.categories[0]?.name ?? "Uncategorized"
        : article.categories?.name ?? "Uncategorized";

      const matchesSearch =
        article.title.toLowerCase().includes(search) ||
        category.toLowerCase().includes(search);

      const matchesStatus =
        activeStatus === "All" ||
        article.status.toLowerCase() === activeStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [articles, searchQuery, activeStatus]);

  // Delete article from Supabase
  const handleDelete = async (article: Article) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${article.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(article.id);

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", article.id);

      if (error) {
        throw new Error(error.message);
      }

      // Remove the cover image from Storage, if one exists
      if (article.cover_image_url) {
        const marker = "/storage/v1/object/public/article-covers/";

        const imagePath = article.cover_image_url.includes(marker)
          ? decodeURIComponent(
              article.cover_image_url.split(marker)[1]
            )
          : null;

        if (imagePath) {
          const { error: imageError } = await supabase.storage
            .from("article-covers")
            .remove([imagePath]);

          if (imageError) {
            console.error("Cover image removal failed:", imageError);
            alert(
              "The article was deleted, but its cover image could not be removed from Storage."
            );
          }
        }
      }

      setArticles((current) =>
        current.filter((item) => item.id !== article.id)
      );

    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      alert("Unable to delete article: " + message);
    } finally {
      setDeletingId(null);
    }
  };

  const statuses: ArticleStatus[] = [
    "All",
    "Published",
    "Draft",
  ];

  const publishedCount = articles.filter(
    (article) => article.status === "published"
  ).length;

  const draftCount = articles.filter(
    (article) => article.status === "draft"
  ).length;

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  function getCategoryName(article: Article) {
    return Array.isArray(article.categories)
      ? article.categories[0]?.name ?? "Uncategorized"
      : article.categories?.name ?? "Uncategorized";
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E9E7E1] bg-white px-6 py-6 md:px-10">
        <div>
          <p className="text-xs text-[#777783]">
            Workspace / Articles
          </p>

          <h1 className="editorial-heading mt-2 text-3xl font-semibold text-[#24264A]">
            Manage Articles
          </h1>

          <p className="mt-2 text-sm text-[#777783]">
            Create, organize, and manage your publication.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-xl bg-[#24264A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#393B65]"
        >
          <Plus size={17} />
          New Article
        </Link>
      </header>

      <div className="px-6 py-8 md:px-10 md:py-10">
        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Articles",
              value: articles.length,
            },
            {
              label: "Published",
              value: publishedCount,
            },
            {
              label: "Drafts",
              value: draftCount,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#E9E7E1] bg-white p-5"
            >
              <p className="text-sm text-[#777783]">
                {item.label}
              </p>

              <p className="mt-3 text-3xl font-semibold text-[#24264A]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#E9E7E1] bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveStatus(status)}
                className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                  activeStatus === status
                    ? "bg-[#24264A] text-white"
                    : "bg-[#F5F4F1] text-[#777783] hover:text-[#24264A]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#E9E7E1] px-4 py-3 md:w-80">
            <Search size={17} className="text-[#9998A0]" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search articles..."
              className="w-full bg-transparent text-sm text-[#24264A] outline-none placeholder:text-[#A2A1AA]"
            />
          </div>
        </div>

        {/* Articles Table */}
        <div className="overflow-hidden rounded-2xl border border-[#E9E7E1] bg-white">
          <div className="flex items-center justify-between border-b border-[#E9E7E1] p-5 md:p-6">
            <div>
              <h2 className="font-semibold text-[#24264A]">
                All Articles
              </h2>

              <p className="mt-1 text-xs text-[#9998A0]">
                Showing {filteredArticles.length} of{" "}
                {articles.length} articles
              </p>
            </div>

            <FileText size={20} className="text-[#777783]" />
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-[#777783]">
                Loading articles from Supabase...
              </p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-[#F0EEE9] text-xs text-[#9998A0]">
                    <th className="px-6 py-4 font-medium">
                      Article
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Category
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Views
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Date
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredArticles.map((article) => {
                    const isPublished =
                      article.status === "published";

                    const date = isPublished
                      ? article.published_at ?? article.created_at
                      : article.created_at;

                    return (
                      <tr
                        key={article.id}
                        className="border-b border-[#F0EEE9] last:border-0 hover:bg-[#FAF9F7]"
                      >
                        <td className="px-6 py-5">
                          <p className="max-w-[260px] text-sm font-semibold text-[#24264A]">
                            {article.title}
                          </p>

                          <p className="mt-1 text-xs text-[#9998A0]">
                            /{article.slug}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-xs text-[#777783]">
                          {getCategoryName(article)}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                              isPublished
                                ? "bg-[#EAF5EE] text-[#32744A]"
                                : "bg-[#FFF4DF] text-[#98702B]"
                            }`}
                          >
                            {isPublished ? "Published" : "Draft"}
                          </span>
                        </td>

                      <td className="px-6 py-5 text-xs font-medium text-[#24264A]">
  {(article.views ?? 0).toLocaleString()}
</td>

                        <td className="px-6 py-5 text-xs text-[#777783]">
                          {formatDate(date)}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            {isPublished && (
                              <Link
                                href={`/blog/${article.slug}`}
                                target="_blank"
                                aria-label="View article"
                                className="rounded-lg border border-[#E9E7E1] p-2 text-[#777783] hover:bg-[#F5F4F1] hover:text-[#24264A]"
                              >
                                <Eye size={16} />
                              </Link>
                            )}

                            <Link
                              href={`/admin/articles/${article.id}/edit`}
                              className="rounded-lg p-2 text-[#777783] transition hover:bg-[#F1F0F8] hover:text-[#24264A]"
                              title="Edit article"
                            >
                              <Pencil size={17} />
                            </Link>

                            <button
                              type="button"
                              aria-label="Delete article"
                              disabled={deletingId === article.id}
                              onClick={() => handleDelete(article)}
                              className="rounded-lg border border-[#E9E7E1] p-2 text-[#777783] hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <MoreHorizontal
                size={30}
                className="mx-auto mb-4 text-[#A2A1AA]"
              />

              <h3 className="font-semibold text-[#24264A]">
                No articles found
              </h3>

              <p className="mt-2 text-sm text-[#777783]">
                {articles.length === 0
                  ? "You haven't created any articles yet."
                  : "Try another search or change your filter."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
