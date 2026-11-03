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
  Sparkles,
  AlertCircle,
  CheckCircle2,
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
  const redirectUrl = searchParams.get("redirect") || searchParams.get("next") || "/";
  const { refreshUser } = useAuth();

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "", form: "" }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const nextErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Please enter your password.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors({
          form: data.message || "Invalid email or password. Please verify your details.",
        });
        return;
      }

      await refreshUser();
      toast.success("Welcome back to Floramade!");

      // Enforce direct window navigation so cookies are registered immediately by Next.js Server Components
      if (typeof window !== "undefined") {
        window.location.href = redirectUrl;
      } else {
        router.replace(redirectUrl);
      }
    } catch {
      setErrors({
        form: "Unable to connect to the authentication server. Please check your network and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative isolate flex min-h-[calc(100svh-92px)] items-center justify-center overflow-hidden bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:py-12">
      {/* Subtle Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#D9E5F3]/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 right-0 h-96 w-96 rounded-full bg-[#D9A441]/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Back to shop */}
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#142B49] transition hover:text-[#D9A441] hover:bg-white/60 w-fit"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Back to Shop</span>
        </Link>

        {/* Auth Card Container */}
        <div className="grid overflow-hidden rounded-[2rem] border border-[#C5D5E8] bg-white shadow-[0_20px_60px_-25px_rgba(20,43,73,0.12)] md:min-h-[580px] md:grid-cols-[0.9fr_1.1fr]">
          
          {/* Left Hero Sidebar (Desktop Only) */}
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#142B49] p-8 text-white md:flex lg:p-12">
            {/* Background Decorative Rings */}
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full border border-white/10"
            />

            {/* Brand Logo & Tag */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 p-2 flex items-center justify-center backdrop-blur-xs">
                <Image
                  src="/floramade-icon.png"
                  alt="Floramade"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div>
                <p className="font-serif text-lg tracking-wider font-bold text-white">Floramade</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D9A441] font-semibold">
                  Pure Ayurveda • Better Life
                </p>
              </div>
            </div>

            {/* Middle Welcome Statement */}
            <div className="relative z-10 my-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles size={13} />
                <span>Customer Sign In</span>
              </div>
              <h2 className="text-3xl lg:text-[2.6rem] font-bold tracking-tight leading-[1.15] text-white">
                Welcome to Authentic Wellness.
              </h2>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-white/75 font-normal">
                Sign in to manage your orders, track fast dispatch, access saved prescriptions, and explore personalized Ayurvedic formulations.
              </p>
            </div>

            {/* Trust Points */}
            <div className="relative z-10 pt-4 border-t border-white/15 space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#D9A441] shrink-0" />
                <span>100% Certified Classical Ayurvedic Herbs</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#D9A441] shrink-0" />
                <span>Encrypted & Protected Sign-in Session</span>
              </div>
            </div>
          </aside>

          {/* Right Form Container */}
          <div className="flex items-center justify-center p-6 sm:p-10 md:p-12 bg-white">
            <div className="w-full max-w-md">
              
              {/* Header */}
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-2.5 md:hidden">
                  <Image
                    src="/floramade-icon.png"
                    alt="Floramade"
                    width={36}
                    height={36}
                    className="rounded-full ring-1 ring-[#142B49]/20"
                  />
                  <span className="font-serif text-lg font-bold text-[#142B49]">
                    Floramade
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#142B49]/10 text-[#142B49] text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Leaf size={11} />
                  <span>Welcome Back</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A2332]">
                  Sign In to Account
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-[#1A2332]/70">
                  Enter your registered credentials to access your store orders.
                </p>
              </div>

              {/* Error Alert Banner */}
              {errors.form && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold leading-relaxed text-rose-800 animate-in fade-in"
                >
                  <AlertCircle size={17} className="text-rose-600 shrink-0 mt-0.5" />
                  <p className="flex-1">{errors.form}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-tight text-[#1A2332]"
                  >
                    Email Address
                  </label>
                  <div
                    className={`flex h-12 items-center gap-3 rounded-xl border bg-[#F7F9FC] px-3.5 transition focus-within:bg-white focus-within:ring-3 ${
                      errors.email
                        ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100"
                        : "border-[#C5D5E8] focus-within:border-[#142B49] focus-within:ring-[#142B49]/15"
                    }`}
                  >
                    <Mail
                      size={17}
                      className="shrink-0 text-[#142B49]/70"
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
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="e.g. yourname@example.com"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#1A2332] outline-none placeholder:text-[#1A2332]/40"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label
                      htmlFor="login-password"
                      className="text-xs font-bold uppercase tracking-tight text-[#1A2332]"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-[#D9A441] hover:text-[#B8852B] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div
                    className={`flex h-12 items-center gap-3 rounded-xl border bg-[#F7F9FC] px-3.5 transition focus-within:bg-white focus-within:ring-3 ${
                      errors.password
                        ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100"
                        : "border-[#C5D5E8] focus-within:border-[#142B49] focus-within:ring-[#142B49]/15"
                    }`}
                  >
                    <LockKeyhole
                      size={17}
                      className="shrink-0 text-[#142B49]/70"
                      aria-hidden="true"
                    />
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Enter your password"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#1A2332] outline-none placeholder:text-[#1A2332]/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="p-1 text-[#142B49]/60 hover:text-[#142B49] cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#142B49] px-5 text-sm font-bold uppercase tracking-tight text-white shadow-md hover:bg-[#0E1F36] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Signing In…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Navigation */}
              <div className="mt-6 pt-5 border-t border-[#C5D5E8]/60 text-center">
                <p className="text-xs text-[#1A2332]/80">
                  New to Floramade?{" "}
                  <Link
                    href={`/register${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                    className="font-bold text-[#142B49] hover:text-[#D9A441] underline-offset-4 hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#1A2332]/50 font-medium">
                  <ShieldCheck size={13} className="text-[#2E6930]" />
                  <span>Secure 256-bit SSL encrypted connection</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
