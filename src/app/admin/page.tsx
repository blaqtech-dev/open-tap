
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import {
  FileText,
  Users,
  Plus,
  ArrowUpRight,
  Clock3,
  Mail,
  MessageSquare,
  FolderOpen,
  Eye,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type RecentArticle = {
  id: string;
  title: string;
  status: "draft" | "published";
  created_at: string;
  categories: { name: string } | { name: string }[] | null;
};

type MostReadArticle = {
  id: string;
  title: string;
  slug: string;
  views: number;
};

async function DashboardContent() {
  await connection();

  const supabase = await createClient();

  const [
    totalArticlesResult,
    publishedArticlesResult,
    draftArticlesResult,
    categoriesResult,
    subscribersResult,
    messagesResult,
    newMessagesResult,
    recentArticlesResult,
    articleViewsResult,
    mostReadArticlesResult,
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),

    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),

    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),

    supabase.from("categories").select("*", { count: "exact", head: true }),

    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),

    supabase
      .from("articles")
      .select("id, title, status, created_at, categories(name)")
      .order("created_at", { ascending: false })
      .limit(5),

    supabase.from("articles").select("views"),

    supabase
      .from("articles")
      .select("id, title, slug, views")
      .eq("status", "published")
      .order("views", { ascending: false })
      .limit(5),
  ]);

  const hasError = [
    totalArticlesResult.error,
    publishedArticlesResult.error,
    draftArticlesResult.error,
    categoriesResult.error,
    subscribersResult.error,
    messagesResult.error,
    newMessagesResult.error,
    recentArticlesResult.error,
    articleViewsResult.error,
    mostReadArticlesResult.error,
  ].some(Boolean);

  // Calculate total views across all articles.
  const totalViews = (articleViewsResult.data ?? []).reduce(
    (total, article) => total + (article.views ?? 0),
    0
  );

  const statistics = [
    {
      label: "Total Articles",
      value: totalArticlesResult.count ?? 0,
      description: "All created articles",
      icon: FileText,
    },
    {
      label: "Published Articles",
      value: publishedArticlesResult.count ?? 0,
      description: "Live on your website",
      icon: FileText,
    },
    {
      label: "Draft Articles",
      value: draftArticlesResult.count ?? 0,
      description: "Awaiting publication",
      icon: Clock3,
    },
    {
      label: "Total Article Views",
      value: totalViews,
      description: "Combined views across all articles",
      icon: Eye,
    },
    {
      label: "Categories",
      value: categoriesResult.count ?? 0,
      description: "Editorial categories",
      icon: FolderOpen,
    },
    {
      label: "Subscribers",
      value: subscribersResult.count ?? 0,
      description: "Newsletter subscribers",
      icon: Users,
    },
    {
      label: "Contact Messages",
      value: messagesResult.count ?? 0,
      description: `${newMessagesResult.count ?? 0} new messages`,
      icon: MessageSquare,
    },
  ];

  const recentArticles = (recentArticlesResult.data ?? []) as RecentArticle[];

  const mostReadArticles = (mostReadArticlesResult.data ??
    []) as MostReadArticle[];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E9E7E1] bg-white px-6 py-6 md:px-10">
        <div>
          <p className="text-xs text-[#777783]">
            Workspace / Overview
          </p>

          <h1 className="editorial-heading mt-2 text-3xl font-semibold text-[#24264A]">
            Dashboard
          </h1>
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
        {/* Welcome */}
        <div className="mb-9">
          <h2 className="text-xl font-semibold text-[#24264A]">
            Welcome back, Editor.
          </h2>

          <p className="mt-2 text-sm text-[#777783]">
            Here's an overview of your publication.
          </p>
        </div>

        {hasError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            Some dashboard information could not be loaded. Please check your
            Supabase permissions and refresh the page.
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E9E7E1] bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#777783]">
                    {stat.label}
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EFF5] text-[#24264A]">
                    <Icon size={19} />
                  </div>
                </div>

                <h3 className="mt-5 text-3xl font-semibold text-[#24264A]">
                  {stat.value.toLocaleString()}
                </h3>

                <p className="mt-2 text-xs text-[#9998A0]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Most Read Articles */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#E9E7E1] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E9E7E1] p-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-[#24264A]" />

                <h3 className="font-semibold text-[#24264A]">
                  Most Read Articles
                </h3>
              </div>

              <p className="mt-1 text-xs text-[#9998A0]">
                Your top five published articles by readership
              </p>
            </div>

            <Link
              href="/admin/articles"
              className="flex items-center gap-2 text-xs font-semibold text-[#24264A] hover:underline"
            >
              Manage articles
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {mostReadArticles.length > 0 ? (
            <div className="divide-y divide-[#F0EEE9]">
              {mostReadArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between gap-4 px-6 py-5"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0EFF5] text-sm font-semibold text-[#24264A]">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="block truncate text-sm font-medium text-[#24264A] hover:underline"
                      >
                        {article.title}
                      </Link>

                      <p className="mt-1 text-xs text-[#9998A0]">
                        Published article
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#777783]">
                    <Eye size={15} />
                    {article.views.toLocaleString()}
                    <span className="hidden sm:inline">views</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Eye size={30} className="mx-auto mb-3 text-[#9998A0]" />

              <p className="text-sm font-medium text-[#24264A]">
                No published articles yet
              </p>

              <p className="mt-2 text-xs text-[#777783]">
                Your most-read articles will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Recent Articles */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#E9E7E1] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E9E7E1] p-6">
            <div>
              <h3 className="font-semibold text-[#24264A]">
                Recent Articles
              </h3>

              <p className="mt-1 text-xs text-[#9998A0]">
                Your latest editorial activity
              </p>
            </div>

            <Link
              href="/admin/articles"
              className="flex items-center gap-2 text-xs font-semibold text-[#24264A] hover:underline"
            >
              View all
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-[#F0EEE9] text-xs text-[#9998A0]">
                  <th className="px-6 py-4 font-medium">Article</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentArticles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-sm text-[#777783]"
                    >
                      No articles yet. Create your first article to get started.
                    </td>
                  </tr>
                ) : (
                  recentArticles.map((article) => {
                    const category = Array.isArray(article.categories)
                      ? article.categories[0]
                      : article.categories;

                    return (
                      <tr
                        key={article.id}
                        className="border-b border-[#F0EEE9] last:border-0"
                      >
                        <td className="px-6 py-5">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="max-w-xs text-sm font-medium text-[#24264A] hover:underline"
                          >
                            {article.title}
                          </Link>
                        </td>

                        <td className="px-6 py-5 text-xs text-[#777783]">
                          {category?.name ?? "Uncategorised"}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                              article.status === "published"
                                ? "bg-[#EAF5EE] text-[#32744A]"
                                : "bg-[#FFF4DF] text-[#98702B]"
                            }`}
                          >
                            {article.status === "published"
                              ? "Published"
                              : "Draft"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-xs text-[#777783]">
                          {new Date(article.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <h3 className="mb-5 font-semibold text-[#24264A]">
            Quick Actions
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Link
              href="/admin/articles/new"
              className="flex items-center gap-4 rounded-2xl border border-[#E9E7E1] bg-white p-5 transition hover:border-[#24264A]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EFF5] text-[#24264A]">
                <Plus size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#24264A]">
                  Create Article
                </p>
                <p className="mt-1 text-xs text-[#777783]">
                  Write a new story
                </p>
              </div>
            </Link>

            <Link
              href="/admin/articles"
              className="flex items-center gap-4 rounded-2xl border border-[#E9E7E1] bg-white p-5 transition hover:border-[#24264A]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EFF5] text-[#24264A]">
                <FileText size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#24264A]">
                  Manage Articles
                </p>
                <p className="mt-1 text-xs text-[#777783]">
                  Edit your stories
                </p>
              </div>
            </Link>

            <Link
              href="/admin/messages"
              className="flex items-center gap-4 rounded-2xl border border-[#E9E7E1] bg-white p-5 transition hover:border-[#24264A]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EFF5] text-[#24264A]">
                <Mail size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#24264A]">
                  View Messages
                </p>
                <p className="mt-1 text-xs text-[#777783]">
                  Manage visitor enquiries
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-sm text-[#777783]">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
