
import Link from "next/link";
import { ArrowRight, BookOpen, Lightbulb, Compass } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container-width py-20">
      <section className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7778a9]">
          About The Open Tab
        </span>

        <h1 className="editorial-heading mt-6 text-5xl leading-tight text-[#24264a] md:text-7xl">
          A space for curious minds and open ideas.
        </h1>

        <p className="mt-7 text-base leading-8 text-[#777783]">
          The Open Tab is a digital publication created to explore
          technology, artificial intelligence, business, personal
          development and the ideas shaping our changing world.
        </p>
      </section>

      <section className="mt-20 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e9e7e1] bg-white p-8">
          <BookOpen size={28} className="text-[#7778a9]" />
          <h2 className="editorial-heading mt-5 text-2xl text-[#24264a]">
            Knowledge
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#777783]">
            Making useful information easier to understand and apply.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e7e1] bg-white p-8">
          <Lightbulb size={28} className="text-[#7778a9]" />
          <h2 className="editorial-heading mt-5 text-2xl text-[#24264a]">
            Ideas
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#777783]">
            Sharing fresh perspectives that inspire creativity and
            thoughtful conversations.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e9e7e1] bg-white p-8">
          <Compass size={28} className="text-[#7778a9]" />
          <h2 className="editorial-heading mt-5 text-2xl text-[#24264a]">
            Discovery
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#777783]">
            Helping readers discover useful tools, opportunities and
            new possibilities.
          </p>
        </div>
      </section>

      <section className="mt-20 rounded-3xl bg-[#24264a] px-8 py-14 text-center text-white">
        <h2 className="editorial-heading text-4xl">
          Stay curious. Keep exploring.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/65">
          There's always something new to learn, discover and think about.
        </p>

        <Link
          href="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#24264a]"
        >
          Explore articles
          <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
