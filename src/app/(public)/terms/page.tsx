
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="container-width py-16 sm:py-24">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2 text-sm text-[#777783] transition hover:text-[#24264A]"
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>

      <div className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#777783]">
          The Open Tab
        </p>

        <h1 className="editorial-heading text-4xl font-bold text-[#24264A] sm:text-6xl">
          Terms of Use
        </h1>

        <p className="mt-5 text-sm text-[#777783]">
          Last updated: November 2026
        </p>

        <div className="mt-12 space-y-10 text-sm leading-8 text-[#62626D]">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              1. Introduction
            </h2>
            <p>
              Welcome to The Open Tab. These Terms of Use explain the
              conditions that apply when you access or use our website.
              By using this website, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              2. Website Content
            </h2>
            <p>
              The Open Tab publishes articles, ideas, educational
              resources and other editorial content covering technology,
              programming, business, careers and related subjects.
            </p>
            <p className="mt-3">
              Our content is provided for general informational and
              educational purposes. It should not be treated as
              professional, financial, legal or technical advice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              3. Acceptable Use
            </h2>
            <p>
              You agree not to misuse the website, attempt unauthorized
              access, interfere with its operation, distribute harmful
              material or use the platform for unlawful activities.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              4. Intellectual Property
            </h2>
            <p>
              Unless otherwise stated, original content, branding,
              design and materials published by The Open Tab belong to
              their respective owners and may not be reproduced or
              redistributed without appropriate permission.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              5. External Links
            </h2>
            <p>
              Our website may contain links to third-party websites.
              We are not responsible for their content, policies or
              practices.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              6. Changes to These Terms
            </h2>
            <p>
              We may update these terms as the website develops.
              Updated versions will be published on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              7. Contact
            </h2>
            <p>
              If you have questions about these terms, please contact
              us through our{" "}
              <Link
                href="/contact"
                className="font-semibold text-[#24264A] underline"
              >
                contact page
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
