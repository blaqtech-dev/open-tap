
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#24264a] text-white">
      <div className="container-width py-16">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Brand Section */}
          <div className="max-w-md">
            <h2 className="editorial-heading text-4xl leading-tight">
              Stay curious.
              <br />
              Keep exploring.
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/65">
              Ideas, tools and perspectives for a changing
              world. Discover something worth reading every day.
            </p>

            <Link
              href="/blog"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#24264a] transition hover:bg-[#e9e7e1]"
            >
              Explore articles
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Footer Navigation */}
          <div className="grid grid-cols-2 gap-8 sm:justify-items-end">
            <div>
              <h3 className="mb-5 text-sm font-semibold">
                Explore
              </h3>

              <div className="flex flex-col gap-4 text-sm text-white/65">
                <Link href="/blog" className="transition hover:text-white">
                  All articles
                </Link>

                <Link
                  href="/category/technology-ai"
                  className="transition hover:text-white"
                >
                  Technology & AI
                </Link>

                <Link
                  href="/category/business-entrepreneurship"
                  className="transition hover:text-white"
                >
                  Business
                </Link>

                <Link
                  href="/category/programming-digital-skills"
                  className="transition hover:text-white"
                >
                  Programming
                </Link>

                <Link
                  href="/category/career-personal-development"
                  className="transition hover:text-white"
                >
                  Career
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-semibold">
                Information
              </h3>

              <div className="flex flex-col gap-4 text-sm text-white/65">
                <Link href="/about" className="transition hover:text-white">
                  About us
                </Link>

                <Link href="/contact" className="transition hover:text-white">
                  Contact
                </Link>

                <Link
                  href="/privacy"
                  className="transition hover:text-white"
                >
                  Privacy policy
                </Link>

                <Link
                  href="/terms"
                  className="transition hover:text-white"
                >
                  Terms of use
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/15 pt-7 text-xs text-white/50 sm:flex-row">
          <p>© 2026 The Open Tab. All rights reserved.</p>

          <p>Read. Discover. Think differently.</p>
        </div>
      </div>
    </footer>
  );
}
