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
  Phone,
  ShieldCheck,
  UserRound,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  marketingConsent: false,
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim().replace(/\D/g, "");
    const nextErrors = {};

    if (name.length < 2) nextErrors.name = "Please enter your full name (at least 2 characters).";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Please enter a valid email address.";
    if (!/^\d{10}$/.test(phone)) nextErrors.phone = "Please enter a valid 10-digit mobile number.";
    if (form.password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords do not match.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password: form.password,
          marketingConsent: form.marketingConsent,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors({ form: data.message || "Failed to create account. Please try again." });
        return;
      }

      await refreshUser();
      toast.success("Your Floramade account has been created!");

      if (typeof window !== "undefined") {
        window.location.href = redirectUrl;
      } else {
        router.replace(redirectUrl);
      }
    } catch {
      setErrors({ form: "Unable to reach the server. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak (min 6 chars)", "Moderate", "Strong password"][strength];
  const strengthColor = ["", "bg-rose-400", "bg-[#D9A441]", "bg-[#2E6930]"][strength];

  return (
    <section className="relative isolate flex min-h-[calc(100svh-92px)] items-center justify-center overflow-hidden bg-[#F7F9FC] px-4 py-8 sm:px-6 lg:py-12">
      {/* Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#D9E5F3]/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 right-0 h-96 w-96 rounded-full bg-[#D9A441]/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#142B49] transition hover:text-[#D9A441] hover:bg-white/60 w-fit"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Back to Shop</span>
        </Link>

        {/* Auth Card Container */}
        <div className="grid overflow-hidden rounded-[2rem] border border-[#C5D5E8] bg-white shadow-[0_20px_60px_-25px_rgba(20,43,73,0.12)] md:min-h-[640px] md:grid-cols-[0.85fr_1.15fr]">
          
          {/* Left Hero Sidebar (Desktop) */}
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#142B49] p-8 text-white md:flex lg:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full border border-white/10"
            />

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

            <div className="relative z-10 my-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#D9A441] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles size={13} />
                <span>Begin Your Journey</span>
              </div>
              <h2 className="text-3xl lg:text-[2.6rem] font-bold tracking-tight leading-[1.15] text-white">
                Authentic Ayurveda for Modern Living.
              </h2>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-white/75 font-normal">
                Join thousands of wellness seekers across India experiencing sustainable sugar balance, metabolic vitality, and holistic well-being.
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/15 space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#D9A441] shrink-0" />
                <span>Zero Synthetic Fillers or Hidden Additives</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#D9A441] shrink-0" />
                <span>Pan-India Fast & Secure Home Delivery</span>
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
                  <span className="font-serif text-lg font-bold text-[#142B49]">Floramade</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#142B49]/10 text-[#142B49] text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Leaf size={11} />
                  <span>Create Account</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A2332]">
                  Join Floramade
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#1A2332]/70">
                  Create an account to track orders and save prescriptions.
                </p>
              </div>

              {/* Error Banner */}
              {errors.form && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold leading-relaxed text-rose-800 animate-in fade-in"
                >
                  <AlertCircle size={17} className="text-rose-600 shrink-0 mt-0.5" />
                  <p className="flex-1">{errors.form}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={onSubmit} noValidate className="space-y-3.5">
                
                {/* Full Name */}
                <div>
                  <label htmlFor="register-name" className="mb-1 block text-xs font-bold uppercase tracking-tight text-[#1A2332]">
                    Full Name
                  </label>
                  <div className={`flex h-11 items-center gap-2.5 rounded-xl border bg-[#F7F9FC] px-3 transition focus-within:bg-white focus-within:ring-3 ${errors.name ? "border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#142B49] focus-within:ring-[#142B49]/15"}`}>
                    <UserRound size={16} className="text-[#142B49]/70 shrink-0" />
                    <input
                      id="register-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="h-full min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-[#1A2332] outline-none placeholder:text-[#1A2332]/40"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="register-email" className="mb-1 block text-xs font-bold uppercase tracking-tight text-[#1A2332]">
                    Email Address
                  </label>
                  <div className={`flex h-11 items-center gap-2.5 rounded-xl border bg-[#F7F9FC] px-3 transition focus-within:bg-white focus-within:ring-3 ${errors.email ? "border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#142B49] focus-within:ring-[#142B49]/15"}`}>
                    <Mail size={16} className="text-[#142B49]/70 shrink-0" />
                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="h-full min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-[#1A2332] outline-none placeholder:text-[#1A2332]/40"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                </div>

                {/* Mobile Phone */}
                <div>
                  <label htmlFor="register-phone" className="mb-1 block text-xs font-bold uppercase tracking-tight text-[#1A2332]">
                    Mobile Number
                  </label>
                  <div className={`flex h-11 items-center gap-2.5 rounded-xl border bg-[#F7F9FC] px-3 transition focus-within:bg-white focus-within:ring-3 ${errors.phone ? "border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#142B49] focus-within:ring-[#142B49]/15"}`}>
                    <Phone size={16} className="text-[#142B49]/70 shrink-0" />
                    <span className="border-r border-[#C5D5E8] pr-2 text-xs font-bold text-[#142B49]">+91</span>
                    <input
                      id="register-phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      required
                      maxLength={10}
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit number"
                      className="h-full min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-[#1A2332] outline-none placeholder:text-[#1A2332]/40"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
                </div>

                {/* Password & Confirm Password */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="register-password" className="mb-1 block text-xs font-bold uppercase tracking-tight text-[#1A2332]">
                      Password
                    </label>
                    <div className={`flex h-11 items-center gap-2 rounded-xl border bg-[#F7F9FC] px-3 transition focus-within:bg-white focus-within:ring-3 ${errors.password ? "border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#142B49] focus-within:ring-[#142B49]/15"}`}>
                      <LockKeyhole size={15} className="text-[#142B49]/70 shrink-0" />
                      <input
                        id="register-password"
                        name="new-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        placeholder="At least 6 chars"
                        className="h-full min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-[#1A2332] outline-none placeholder:text-[#1A2332]/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-[#142B49]/60 hover:text-[#142B49] p-0.5 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.password ? (
                      <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
                    ) : (
                      strength > 0 && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <div className="flex gap-1 flex-1">
                            {[1, 2, 3].map((step) => (
                              <span
                                key={step}
                                className={`h-1 flex-1 rounded-full ${strength >= step ? strengthColor : "bg-[#C5D5E8]"}`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-semibold text-[#1A2332]/60">{strengthLabel}</span>
                        </div>
                      )
                    )}
                  </div>

                  <div>
                    <label htmlFor="register-confirm-password" className="mb-1 block text-xs font-bold uppercase tracking-tight text-[#1A2332]">
                      Confirm Password
                    </label>
                    <div className={`flex h-11 items-center gap-2 rounded-xl border bg-[#F7F9FC] px-3 transition focus-within:bg-white focus-within:ring-3 ${errors.confirmPassword ? "border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#142B49] focus-within:ring-[#142B49]/15"}`}>
                      <LockKeyhole size={15} className="text-[#142B49]/70 shrink-0" />
                      <input
                        id="register-confirm-password"
                        name="confirm-password"
                        type={showConfirmation ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={form.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        placeholder="Repeat password"
                        className="h-full min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-[#1A2332] outline-none placeholder:text-[#1A2332]/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmation((v) => !v)}
                        className="text-[#142B49]/60 hover:text-[#142B49] p-0.5 cursor-pointer"
                      >
                        {showConfirmation ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Marketing Consent */}
                <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[#C5D5E8]/60 bg-[#F7F9FC] p-3 text-xs text-[#1A2332]/80 hover:border-[#142B49]/40 transition">
                  <input
                    type="checkbox"
                    checked={form.marketingConsent}
                    onChange={(e) => updateField("marketingConsent", e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-[#142B49] cursor-pointer"
                  />
                  <span>Send me Ayurvedic wellness tips and special offers. You can unsubscribe anytime.</span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#142B49] px-5 text-sm font-bold uppercase tracking-tight text-white shadow-md hover:bg-[#0E1F36] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Creating Account…</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Navigation */}
              <div className="mt-5 pt-4 border-t border-[#C5D5E8]/60 text-center">
                <p className="text-xs text-[#1A2332]/80">
                  Already registered?{" "}
                  <Link
                    href={`/login${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                    className="font-bold text-[#142B49] hover:text-[#D9A441] underline-offset-4 hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-[#1A2332]/50 font-medium">
                  <ShieldCheck size={13} className="text-[#2E6930]" />
                  <span>Your information is strictly protected by privacy laws</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
