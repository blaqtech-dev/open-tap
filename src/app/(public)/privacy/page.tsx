
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          Privacy Policy
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
              Welcome to The Open Tab. We respect your privacy and
              are committed to handling personal information
              responsibly when you use our website.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              2. Information We May Collect
            </h2>
            <p>
              Depending on the features you use, we may collect
              information such as your name, email address,
              account details, newsletter subscription details
              and messages submitted through our contact form.
            </p>
            <p className="mt-3">
              We may also collect basic technical information
              such as browser type, device information and
              website usage data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              3. How We Use Information
            </h2>
            <p>
              Information may be used to operate and improve
              The Open Tab, manage user accounts, respond to
              enquiries, deliver newsletter updates and
              understand how visitors interact with our content.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              4. Cookies and Similar Technologies
            </h2>
            <p>
              Our website and its service providers may use
              cookies or similar technologies to support
              essential functionality, maintain authentication
              sessions and improve website performance.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              5. Data Storage and Security
            </h2>
            <p>
              We intend to use appropriate technical and
              organisational measures to protect information
              handled by the website. Some information may be
              stored or processed by service providers that
              support our platform.
            </p>
            <p className="mt-3">
              No online service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              6. Sharing of Information
            </h2>
            <p>
              We do not sell personal information. Information
              may be shared with service providers where
              reasonably necessary to operate the website,
              provide requested services or meet legal
              obligations.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              7. Your Privacy Choices
            </h2>
            <p>
              You may contact us to ask about personal
              information associated with your use of the
              website, request corrections or ask about
              applicable deletion options.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy as our website
              and services develop. Any updated version will
              be published on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-[#24264A]">
              9. Contact Us
            </h2>
            <p>
              For privacy-related questions, please contact us
              through our{" "}
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
