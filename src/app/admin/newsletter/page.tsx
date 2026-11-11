
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Mail,
  Search,
  Download,
  Trash2,
  Users,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function NewsletterPage() {
  const supabase = useMemo(() => createClient(), []);

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Newsletter loading error:", error);
      setError("Unable to load subscribers. Please try again.");
      setLoading(false);
      return;
    }

    setSubscribers(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Export the subscriber list as a CSV file.
  const exportCSV = () => {
    if (filteredSubscribers.length === 0) {
      alert("There are no subscribers to export.");
      return;
    }

    const escapeCSV = (value: string) =>
      `"${value.replace(/"/g, '""')}"`;

    const rows = [
      ["Email Address", "Subscription Date"],
      ...filteredSubscribers.map((subscriber) => [
        subscriber.email,
        formatDate(subscriber.created_at),
      ]),
    ];

    const csvContent = rows
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "the-open-tab-newsletter-subscribers.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // Delete an individual subscriber.
  const handleDelete = async (subscriber: Subscriber) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${subscriber.email} from your newsletter subscribers?`
    );

    if (!confirmed) return;

    setDeletingId(subscriber.id);

    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", subscriber.id);

    if (error) {
      console.error("Subscriber deletion error:", error);
      alert("Unable to delete this subscriber. Please try again.");
      setDeletingId(null);
      return;
    }

    setSubscribers((previous) =>
      previous.filter((item) => item.id !== subscriber.id)
    );

    setDeletingId(null);
  };

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#777783]">
              Audience management
            </p>

            <h1 className="editorial-heading text-4xl font-bold text-[#24264A]">
              Newsletter
            </h1>

            <p className="mt-2 text-sm text-[#777783]">
              Manage people subscribed to The Open Tab.
            </p>
          </div>

          <button
            onClick={exportCSV}
            disabled={filteredSubscribers.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#24264A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#35385F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E9E7E1] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#777783]">
                Total subscribers
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F0F8] text-[#24264A]">
                <Users size={20} />
              </div>
            </div>

            <h2 className="mt-4 text-3xl font-bold text-[#24264A]">
              {subscribers.length.toLocaleString()}
            </h2>

            <p className="mt-2 text-xs text-[#9998A0]">
              Registered newsletter subscribers
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9E7E1] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#777783]">
                Latest subscription
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F0F8] text-[#24264A]">
                <CalendarDays size={20} />
              </div>
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#24264A]">
              {subscribers.length > 0
                ? formatDate(subscribers[0].created_at)
                : "No subscriptions"}
            </h2>

            <p className="mt-2 text-xs text-[#9998A0]">
              Most recent subscriber
            </p>
          </div>
        </div>

        {/* Search and refresh */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#E9E7E1] bg-white px-4">
            <Search size={18} className="text-[#9999A1]" />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscriber email..."
              className="w-full bg-transparent py-4 text-sm outline-none"
            />
          </div>

          <button
            onClick={fetchSubscribers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E9E7E1] bg-white px-5 py-3 text-sm font-semibold text-[#24264A] transition hover:bg-[#F8F7F4] disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={fetchSubscribers}
              className="ml-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Subscribers table */}
        <div className="overflow-hidden rounded-2xl border border-[#E9E7E1] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9E7E1] p-6">
            <div>
              <h3 className="font-semibold text-[#24264A]">
                Subscriber List
              </h3>

              <p className="mt-1 text-xs text-[#9998A0]">
                {filteredSubscribers.length} subscriber
                {filteredSubscribers.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#777783]">
              <Mail size={15} />
              Email subscribers
            </div>
          </div>

          {loading ? (
            <div className="px-5 py-16 text-center text-sm text-[#777783]">
              Loading subscribers...
            </div>
          ) : filteredSubscribers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-[#F0EEE9] text-xs text-[#9998A0]">
                    <th className="px-6 py-4 font-medium">
                      Email Address
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Subscription Date
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSubscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="border-b border-[#F0EEE9] last:border-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F0F8] text-[#24264A]">
                            <Mail size={16} />
                          </div>

                          <span className="text-sm font-medium text-[#24264A]">
                            {subscriber.email}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-xs text-[#777783]">
                        {formatDate(subscriber.created_at)}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleDelete(subscriber)}
                          disabled={deletingId === subscriber.id}
                          title="Remove subscriber"
                          className="rounded-lg p-2 text-[#9999A1] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-16 text-center">
              <Mail
                size={32}
                className="mx-auto mb-4 text-[#9999A1]"
              />

              <h3 className="font-bold text-[#24264A]">
                {searchQuery
                  ? "No subscribers found"
                  : "No subscribers yet"}
              </h3>

              <p className="mt-2 text-sm text-[#777783]">
                {searchQuery
                  ? "Try searching with another email address."
                  : "Newsletter subscriptions will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
