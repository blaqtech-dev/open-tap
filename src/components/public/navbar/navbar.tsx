
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

import InstallAppButton from "@/components/pwa/install-app-button";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Explore", href: "/blog" },
  { name: "Technology", href: "/category/technology-ai" },
  { name: "Business", href: "/category/business-entrepreneurship" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e7e1] bg-[#f8f7f4]/95 backdrop-blur-md">
      <div className="container-width flex h-[76px] items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#24264a] text-lg font-bold text-white">
            O
          </div>

          <span className="text-xl font-bold tracking-tight text-[#24264a]">
            The Open Tab<span className="text-[#8b8ca3]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-[#62626d] transition hover:text-[#24264a]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/search"
            aria-label="Search articles"
            className="text-[#555568] transition hover:text-[#24264a]"
          >
            <Search size={20} />
          </Link>

          <InstallAppButton />

          <Link
            href="/blog"
            className="flex items-center gap-2 rounded-full bg-[#24264a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#383b6a]"
          >
            Start reading
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          className="rounded-lg p-2 text-[#24264a] md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-[#e9e7e1] bg-[#f8f7f4] px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="text-sm font-medium text-[#24264a]"
              >
                {item.name}
              </Link>
            ))}

            <Link
              href="/search"
              onClick={closeMenu}
              className="flex items-center gap-2 text-sm text-[#24264a]"
            >
              <Search size={17} />
              Search articles
            </Link>

            {/* Mobile Install App */}
            <div>
              <InstallAppButton />
            </div>

            <Link
              href="/blog"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 rounded-full bg-[#24264a] px-5 py-3 text-sm font-medium text-white"
            >
              Start reading
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
