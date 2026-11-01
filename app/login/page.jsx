"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl =
    searchParams.get("redirect") || searchParams.get("next") || "/";
  const { refreshUser } = useAuth();

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "", form: "" }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const nextErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(email))
      nextErrors.email = "Enter a valid email address.";
    if (!form.password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: form.password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors({
          form:
            data.message ||
            "We couldn’t sign you in. Check your details and try again.",
        });
        return;
      }

      await refreshUser();
      toast.success("Welcome back to Floramade.");
      if (typeof window !== "undefined") {
        window.location.href = redirectUrl;
      } else {
        router.replace(redirectUrl);
      }
    } catch {
      setErrors({
        form: "We couldn’t reach the server. Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative isolate flex min-h-[calc(100svh-92px)] items-center overflow-hidden bg-[#F7F9FC] px-4 py-10 sm:px-6 lg:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-[#D9E5F3]/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 right-0 h-96 w-96 rounded-full bg-[#D9E5F3]/60 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm text-[#1A2332] transition hover:text-[#D9A441] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to shop
        </Link>

        <div className="grid overflow-hidden rounded-[2rem] border border-[#C5D5E8] bg-[#F7F9FC] shadow-[0_24px_80px_-38px_rgba(20,43,73,0.15)] md:min-h-[590px] md:grid-cols-[0.9fr_1.1fr]">
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#142B49] p-10 text-white md:flex lg:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full border border-white/10"
            />

            <div className="relative z-10 flex items-center gap-3">
              <Image
                src="/floramade-icon.png"
                alt=""
                width={56}
                height={56}
                className="rounded-full ring-1 ring-[#D9A441]/60"
              />
              <div>
                <p className="font-display text-lg tracking-wide">Floramade</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                  Ayurvedic wellness
                </p>
              </div>
            </div>

            <div className="relative z-10 my-12">
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#F7F9FC]/5 text-[#D9A441]">
                <Leaf size={20} aria-hidden="true" />
              </span>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#D9A441]">
                Your wellness, your way
              </p>
              <h2 className="max-w-sm text-4xl leading-[1.12] tracking-[-0.04em] lg:text-[2.8rem]">
                A thoughtful routine starts here.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
                Sign in to follow your orders, manage your details, and keep
                your wellness essentials close.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-xs text-white/60">
              <ShieldCheck
                size={16}
                className="text-[#D9A441]"
                aria-hidden="true"
              />
              Your account is protected with secure sign-in.
            </div>
          </aside>

          <div className="flex items-center px-6 py-9 sm:px-10 md:px-12 lg:px-16">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 md:mb-10">
                <div className="mb-5 flex items-center gap-3 md:hidden">
                  <Image
                    src="/floramade-icon.png"
                    alt=""
                    width={42}
                    height={42}
                    className="rounded-full"
                  />
                  <span className="font-display text-lg text-[#142B49]">
                    Floramade
                  </span>
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A2332]">
                  Welcome back
                </p>
                <h1 className="font-display text-3xl text-[#1A2332] sm:text-4xl">
                  Sign in to your account
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#1A2332]">
                  Pick up where you left off with your Floramade orders.
                </p>
              </div>

              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-sm font-medium text-[#1A2332]"
                  >
                    Email address
                  </label>
                  <div
                    className={`flex h-[3.25rem] items-center gap-3 rounded-xl border bg-[#FFFFFF] px-4 transition focus-within:ring-4 ${errors.email ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#D9A441] focus-within:ring-[#D9E5F3]"}`}
                  >
                    <Mail
                      size={18}
                      className="shrink-0 text-[#142B49]"
                      aria-hidden="true"
                    />
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck="false"
                      required
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "login-email-error" : undefined
                      }
                      className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1A2332] outline-none placeholder:text-[#8E9AA8]"
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="login-email-error"
                      className="mt-2 text-xs text-rose-700"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="login-password"
                      className="text-sm font-medium text-[#1A2332]"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-[#D9A441] underline-offset-4 transition hover:text-[#142B49] hover:text-[#C48F2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div
                    className={`flex h-[3.25rem] items-center gap-3 rounded-xl border bg-[#FFFFFF] px-4 transition focus-within:ring-4 ${errors.password ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#D9A441] focus-within:ring-[#D9E5F3]"}`}
                  >
                    <LockKeyhole
                      size={18}
                      className="shrink-0 text-[#142B49]"
                      aria-hidden="true"
                    />
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      placeholder="Enter your password"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password ? "login-password-error" : undefined
                      }
                      className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1A2332] outline-none placeholder:text-[#8E9AA8]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="rounded-md p-1 text-[#142B49] transition hover:text-[#142B49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]"
                    >
                      {showPassword ? (
                        <EyeOff size={18} aria-hidden="true" />
                      ) : (
                        <Eye size={18} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="login-password-error"
                      className="mt-2 text-xs text-rose-700"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                {errors.form && (
                  <p
                    role="alert"
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-800"
                  >
                    {errors.form}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-[#142B49] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(20,43,73,0.5)] transition hover:bg-[#0E1F36] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D9E5F3] disabled:cursor-not-allowed disabled:opacity-65"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in{" "}
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-[#1A2332]">
                New to Floramade?{" "}
                <Link
                  href={`/register${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                  className="font-semibold text-[#D9A441] underline-offset-4 transition hover:text-[#142B49] hover:text-[#C48F2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]"
                >
                  Create an account
                </Link>
              </p>
              <p className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8E9AA8]">
                <ShieldCheck size={14} aria-hidden="true" /> Secure sign-in for
                your account
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
