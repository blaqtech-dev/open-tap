
"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || loading) return;

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: normalizedEmail });

      if (error) {
        if (error.code === "23505") {
          setMessage("This email is already subscribed to our newsletter.");
        } else {
          setMessage("Something went wrong. Please try again.");
        }

        setIsError(true);
        return;
      }

      setSubscribed(true);
      setEmail("");
    } catch {
      setMessage("Unable to complete your subscription. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-width py-16 md:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-[#24264A] px-6 py-14 text-white md:px-14 md:py-16">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -right-8 -top-12 h-52 w-52 rounded-full border border-white/10" />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Mail size={22} />
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            The Open Tab Newsletter
          </p>

          <h2 className="editorial-heading text-3xl font-semibold leading-tight md:text-5xl">
            Good ideas deserve
            <span className="block text-[#C9C9DD]">
              to be shared.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/65">
            Get thoughtful articles, useful discoveries, and
            fresh perspectives delivered straight to your inbox.
          </p>

          {subscribed ? (
            <div className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-xl bg-white/10 px-5 py-4 text-sm">
              <CheckCircle2 size={20} className="shrink-0" />
              <span>
                Thank you! Your subscription has been received.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-9 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                disabled={loading}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white px-5 py-4 text-sm text-[#24264A] outline-none placeholder:text-[#9998A0] focus:ring-2 focus:ring-white/30 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-semibold text-[#24264A] transition hover:bg-[#E9E5DC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Subscribing..." : "Subscribe"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>
          )}

          {message && (
            <p
              role="status"
              className={`mt-4 text-sm ${
                isError ? "text-red-200" : "text-white"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-5 text-xs text-white/40">
            No spam. Just meaningful content. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
