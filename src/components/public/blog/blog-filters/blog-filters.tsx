
"use client";

import { Search, X } from "lucide-react";

interface BlogFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function BlogFilters({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: BlogFiltersProps) {
  return (
    <section className="w-full">
      {/* Search input */}
      <div className="relative mb-7 max-w-xl">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777783]"
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search articles, topics and ideas..."
          className="h-13 w-full rounded-xl border border-[#e9e7e1] bg-white pl-12 pr-12 text-sm text-[#24264a] outline-none transition-all placeholder:text-[#9999a2] focus:border-[#24264a] focus:ring-2 focus:ring-[#24264a]/10"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777783] transition-colors hover:text-[#24264a]"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-3 overflow-x-auto pb-3">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-[#24264a] bg-[#24264a] text-white"
                  : "border-[#e9e7e1] bg-white text-[#777783] hover:border-[#24264a] hover:text-[#24264a]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
}
