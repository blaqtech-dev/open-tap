
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Enter your administrator email address first.");
      return;
    }

    setResetLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(
        "If an account exists for this email, a password recovery link will be sent."
      );
    } catch {
      setError("Unable to send the recovery email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F4] px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 block text-center">
          <span className="editorial-heading text-3xl font-bold text-[#24264A]">
            The Open Tab
          </span>
          <span className="mt-2 block text-sm text-[#777783]">
            Ideas, tools and perspectives for a changing world.
          </span>
        </Link>

        <div className="rounded-2xl border border-[#E9E7E1] bg-white p-7 shadow-sm sm:p-9">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#24264A] text-white">
              <LockKeyhole size={22} />
            </div>

            <h1 className="editorial-heading text-3xl font-bold text-[#24264A]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#777783]">
              Sign in to access The Open Tab administration dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#24264A]"
              >
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#E9E7E1] px-4 focus-within:border-[#24264A]">
                <Mail size={18} className="text-[#777783]" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-transparent py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#24264A]"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-xs font-semibold text-[#24264A] hover:underline disabled:opacity-60"
                >
                  {resetLoading ? "Sending..." : "Forgot password?"}
                </button>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E9E7E1] px-4 focus-within:border-[#24264A]">
                <LockKeyhole size={18} className="text-[#777783]" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent py-3.5 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#777783] hover:text-[#24264A]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#24264A] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#35385F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to dashboard"}
            </button>
          </form>
        </div>

        <p className="mt-7 text-center text-xs text-[#777783]">
          © 2026 The Open Tab. Admin access only.
        </p>
      </div>
    </main>
  );
}
