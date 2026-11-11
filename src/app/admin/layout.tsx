
import type { ReactNode } from "react";
import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";

import AdminSidebar from "@/components/admin/admin-sidebar/admin-sidebar";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

async function AdminContent({ children }: { children: ReactNode }) {
  await connection();

  const supabase = await createClient();

  // Check whether the user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Redirect unauthenticated visitors
  if (authError || !user) {
    redirect("/login");
  }

  // Verify administrator permissions
  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || admin?.role !== "admin") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F7F4] lg:flex">
          <div className="hidden w-64 shrink-0 bg-[#24264A] lg:block" />
          <main className="flex-1 p-8">
            <div className="mx-auto max-w-6xl animate-pulse">
              <div className="h-8 w-48 rounded-lg bg-[#E9E5DC]" />
              <div className="mt-6 h-40 rounded-2xl bg-white" />
            </div>
          </main>
        </div>
      }
    >
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}
