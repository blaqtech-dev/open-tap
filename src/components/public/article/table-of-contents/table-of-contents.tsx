
"use client";

import { List, ChevronRight } from "lucide-react";

interface TableOfContentsProps {
  headings: string[];
}

export default function TableOfContents({
  headings,
}: TableOfContentsProps) {
  const createId = (heading: string) =>
    heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-2xl border border-[#e9e7e1] bg-white p-6"
    >
      <div className="flex items-center gap-2">
        <List size={18} className="text-[#24264a]" />

        <h3 className="text-sm font-bold text-[#24264a]">
          In this article
        </h3>
      </div>

      <ul className="mt-5 space-y-3">
        {headings.map((heading) => {
          const id = createId(heading);

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className="group flex items-start gap-2 text-sm leading-6 text-[#777783] transition-colors hover:text-[#24264a]"
              >
                <ChevronRight
                  size={15}
                  className="mt-1 shrink-0 transition-transform group-hover:translate-x-1"
                />

                <span>{heading}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
