
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !subject || !message) {
      setErrorMessage("Please complete all fields before submitting.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSubmitted(false);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name,
          email,
          subject,
          message,
        });

      if (error) {
        throw error;
      }

      setSubmitted(true);
      form.reset();
    } catch {
      setErrorMessage(
        "We couldn't send your message. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">

      {/* Hero section */}
      <section className="container-width max-w-6xl pb-16 pt-20 sm:pb-20 sm:pt-28">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#777783]">
            Get in touch
          </span>

          <h1 className="editorial-heading mt-6 text-5xl font-bold leading-tight text-[#24264a] sm:text-6xl lg:text-7xl">
            Let's start a
            <span className="block text-[#777783]">
              conversation.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-[#777783] sm:text-lg">
            Have a story to share, an idea to discuss or a question
            about The Open Tab? We'd love to hear from you.
            Reach out and let's connect.
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="border-t border-[#e9e7e1] bg-white py-16 sm:py-20">
        <div className="container-width max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

            {/* Contact information */}
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#777783]">
                Contact information
              </span>

              <h2 className="editorial-heading mt-5 text-3xl font-bold text-[#24264a] sm:text-4xl">
                We'd like to hear from you.
              </h2>

              <p className="mt-5 text-base leading-8 text-[#777783]">
                Whether you're a reader, writer, creative professional
                or potential collaborator, our inbox is open.
              </p>

              {/* Email card */}
              <div className="mt-10 rounded-2xl border border-[#e9e7e1] bg-[#f8f7f4] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#24264a] text-white">
                  <Mail size={21} />
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#777783]">
                  Send us an email
                </p>

                <a
                  href="mailto:abiolaboluwatife28@gmail.com"
                  className="mt-3 inline-flex items-center gap-2 break-all text-base font-semibold text-[#24264a] transition-colors hover:text-[#777783] sm:text-lg"
                >
                  abiolaboluwatife28@gmail.com
                  <ArrowUpRight size={17} className="shrink-0" />
                </a>

                <p className="mt-3 text-sm leading-6 text-[#777783]">
                  For general questions, feedback and business enquiries.
                </p>
              </div>

              {/* Editorial enquiries */}
              <div className="mt-6 rounded-2xl border border-[#e9e7e1] p-6">
                <div className="flex items-center gap-3">
                  <MessageCircle size={20} className="text-[#24264a]" />

                  <h3 className="font-semibold text-[#24264a]">
                    Editorial & collaborations
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-7 text-[#777783]">
                  Have an interesting story, an article submission,
                  a partnership proposal or an idea worth exploring?
                  Get in touch with our editorial team.
                </p>
              </div>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#24264a] transition-colors hover:text-[#777783]"
              >
                Learn more about The Open Tab
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* Contact form */}
            <div className="rounded-3xl border border-[#e9e7e1] bg-[#f8f7f4] p-6 sm:p-10">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#777783]">
                  Send a message
                </span>

                <h2 className="editorial-heading mt-4 text-3xl font-bold text-[#24264a]">
                  How can we help?
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#777783]">
                  Fill in the details below and tell us what's on your mind.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-[#24264a]"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    disabled={loading}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-[#e9e7e1] bg-white px-4 py-4 text-sm text-[#24264a] outline-none transition-all placeholder:text-[#a0a0a8] focus:border-[#24264a] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#24264a]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    disabled={loading}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#e9e7e1] bg-white px-4 py-4 text-sm text-[#24264a] outline-none transition-all placeholder:text-[#a0a0a8] focus:border-[#24264a] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-[#24264a]"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    maxLength={200}
                    disabled={loading}
                    placeholder="What is your message about?"
                    className="w-full rounded-xl border border-[#e9e7e1] bg-white px-4 py-4 text-sm text-[#24264a] outline-none transition-all placeholder:text-[#a0a0a8] focus:border-[#24264a] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-[#24264a]"
                  >
                    Your message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    maxLength={5000}
                    disabled={loading}
                    placeholder="Write your message here..."
                    className="w-full resize-none rounded-xl border border-[#e9e7e1] bg-white px-4 py-4 text-sm leading-7 text-[#24264a] outline-none transition-all placeholder:text-[#a0a0a8] focus:border-[#24264a] disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-[#24264a] px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-[#383b69] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    "Sending message..."
                  ) : (
                    <>
                      <Send size={17} />
                      Send message
                    </>
                  )}
                </button>

                {submitted && (
                  <div
                    role="status"
                    className="flex items-start gap-3 rounded-xl bg-[#e9e5dc] p-4 text-sm leading-6 text-[#24264a]"
                  >
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                    <span>
                      Your message has been sent successfully.
                      Thank you for reaching out to The Open Tab.
                    </span>
                  </div>
                )}

                {errorMessage && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700"
                  >
                    {errorMessage}
                  </p>
                )}

                <p className="text-center text-xs leading-6 text-[#777783]">
                  Your information will be used to respond to your enquiry.
                  We appreciate you getting in touch.
                </p>

              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Closing section */}
      <section className="container-width max-w-6xl py-20 text-center sm:py-28">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#777783]">
          The Open Tab
        </span>

        <h2 className="editorial-heading mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight text-[#24264a] sm:text-5xl">
          Every great idea starts with a conversation.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#777783] sm:text-base">
          Stay curious, keep exploring and never stop asking questions.
        </p>
      </section>

    </div>
  );
}
