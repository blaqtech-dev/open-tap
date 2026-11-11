
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Mail,
  MailOpen,
  MessageSquare,
  Clock,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  created_at: string;
};

type FilterType = "all" | "new" | "read" | "replied";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const supabase = useMemo(() => createClient(), []);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Unable to load messages. Please try again.");
      setMessages([]);
    } else {
      setMessages((data || []) as ContactMessage[]);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const counts = {
    all: messages.length,
    new: messages.filter((item) => item.status === "new").length,
    read: messages.filter((item) => item.status === "read").length,
    replied: messages.filter((item) => item.status === "replied").length,
  };

  const filteredMessages = messages.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;

    const searchText = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.email.toLowerCase().includes(searchText) ||
      item.subject.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  const updateStatus = async (
    id: string,
    status: ContactMessage["status"]
  ) => {
    setUpdating(true);
    setError("");

    const { error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id);

    if (error) {
      setError("Unable to update this message. Please try again.");
      setUpdating(false);
      return;
    }

    setMessages((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setSelectedMessage((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );

    setUpdating(false);
  };

  const openMessage = async (item: ContactMessage) => {
    setSelectedMessage(item);

    if (item.status === "new") {
      await updateStatus(item.id, "read");
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const filters: { label: string; value: FilterType }[] = [
    { label: "All messages", value: "all" },
    { label: "New", value: "new" },
    { label: "Read", value: "read" },
    { label: "Replied", value: "replied" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777783]">
            Communication
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#24264a]">
            Messages
          </h1>
          <p className="mt-2 text-sm text-[#777783]">
            Manage enquiries and messages from your visitors.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#e9e7e1] bg-white px-5 py-3 text-sm font-semibold text-[#24264a] transition hover:bg-[#f8f7f4] disabled:opacity-60"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "All messages", count: counts.all, icon: MessageSquare },
          { label: "New messages", count: counts.new, icon: Mail },
          { label: "Read messages", count: counts.read, icon: MailOpen },
          { label: "Replied", count: counts.replied, icon: Clock },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#e9e7e1] bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#777783]">{item.label}</p>
              <item.icon size={19} className="text-[#777783]" />
            </div>
            <p className="mt-4 text-3xl font-bold text-[#24264a]">
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-[#e9e7e1] bg-white p-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9998a0]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or subject..."
            className="w-full rounded-xl border border-[#e9e7e1] bg-[#f8f7f4] py-3 pl-11 pr-4 text-sm text-[#24264a] outline-none focus:border-[#24264a]"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === item.value
                  ? "bg-[#24264a] text-white"
                  : "bg-[#f8f7f4] text-[#777783] hover:bg-[#e9e5dc]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Messages list */}
      <div className="overflow-hidden rounded-2xl border border-[#e9e7e1] bg-white">
        <div className="border-b border-[#e9e7e1] px-6 py-5">
          <h2 className="font-semibold text-[#24264a]">
            Inbox
            <span className="ml-2 text-sm font-normal text-[#777783]">
              ({filteredMessages.length})
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-[#777783]">
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <Mail size={30} className="mx-auto text-[#9998a0]" />
            <p className="mt-4 font-semibold text-[#24264a]">
              No messages found
            </p>
            <p className="mt-2 text-sm text-[#777783]">
              Messages from your contact form will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e9e7e1]">
            {filteredMessages.map((item) => (
              <button
                key={item.id}
                onClick={() => openMessage(item)}
                className="flex w-full flex-col gap-4 px-6 py-5 text-left transition hover:bg-[#f8f7f4] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-[#24264a]">
                      {item.name}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "new"
                          ? "bg-blue-50 text-blue-700"
                          : item.status === "read"
                            ? "bg-[#f1efe9] text-[#777783]"
                            : "bg-green-50 text-green-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-2 truncate text-sm font-medium text-[#24264a]">
                    {item.subject}
                  </p>

                  <p className="mt-1 truncate text-sm text-[#777783]">
                    {item.email}
                  </p>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <span className="text-xs text-[#9998a0]">
                    {formatDate(item.created_at)}
                  </span>
                  <Eye size={17} className="text-[#777783]" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Message details */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777783]">
                  Message details
                </p>
                <h2
                  id="message-title"
                  className="mt-3 text-2xl font-bold text-[#24264a]"
                >
                  {selectedMessage.subject}
                </h2>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message"
                className="rounded-full bg-[#f8f7f4] p-2 text-[#24264a] hover:bg-[#e9e5dc]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-7 space-y-3 rounded-2xl bg-[#f8f7f4] p-5 text-sm">
              <p>
                <span className="font-semibold text-[#24264a]">From: </span>
                <span className="text-[#777783]">{selectedMessage.name}</span>
              </p>
              <p>
                <span className="font-semibold text-[#24264a]">Email: </span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-[#24264a] underline"
                >
                  {selectedMessage.email}
                </a>
              </p>
              <p className="text-[#777783]">
                {formatDate(selectedMessage.created_at)}
              </p>
            </div>

            <div className="py-7">
              <h3 className="mb-3 text-sm font-semibold text-[#24264a]">
                Message
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-8 text-[#777783]">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#e9e7e1] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <select
                value={selectedMessage.status}
                disabled={updating}
                onChange={(event) =>
                  updateStatus(
                    selectedMessage.id,
                    event.target.value as ContactMessage["status"]
                  )
                }
                className="rounded-xl border border-[#e9e7e1] bg-white px-4 py-3 text-sm text-[#24264a] outline-none"
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>

              <a
                href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                  `Re: ${selectedMessage.subject}`
                )}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#24264a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#383b69]"
              >
                <Mail size={16} />
                Reply by email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
