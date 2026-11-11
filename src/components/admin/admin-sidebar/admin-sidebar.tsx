
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  PlusCircle,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  Mail,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    label: "Articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    label: "Create Article",
    href: "/admin/articles/new",
    icon: PlusCircle,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
const supabase = createClient();

const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Unable to sign out. Please try again.");
    return;
  }

  setMobileOpen(false);
  router.replace("/login");
  router.refresh();
};

  const sidebarContent = (
    <>
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#24264A]">
            O
          </div>

          <div>
            <p className="font-semibold text-white">The Open Tab</p>
            <p className="mt-0.5 text-[10px] tracking-wider text-white/50">
              ADMINISTRATION
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
          className="text-white/60 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 py-8">
        <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive = mounted
              ? item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)
              : false;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  isActive
                    ? "bg-white font-semibold text-[#24264A]"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 p-4">
        <Link
          href="/"
          className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          <Globe size={18} />
          View Website
        </Link>

       <button
  type="button"
  onClick={handleSignOut}
  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/65 transition hover:bg-white/10 hover:text-white"
>
  <LogOut size={18} />
  Sign Out
</button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#24264A] px-5 lg:hidden">
        <Link href="/admin" className="font-semibold text-white">
          The Open Tab
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
          className="text-white"
        >
          <Menu size={23} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden min-h-screen w-[260px] shrink-0 flex-col bg-[#24264A] lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-[#24264A]">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
