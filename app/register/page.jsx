"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Leaf, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const initialForm = { name: "", email: "", phone: "", password: "", confirmPassword: "", marketingConsent: false };

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
    const nextErrors = {};

    if (name.length < 2) nextErrors.name = "Enter your name (at least 2 characters).";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!/^\d{10}$/.test(form.phone)) nextErrors.phone = "Enter a 10-digit mobile number.";
    if (form.password.length < 6) nextErrors.password = "Use at least 6 characters.";
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords don’t match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: form.phone, password: form.password, marketingConsent: form.marketingConsent }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors({ form: data.message || "We couldn’t create your account. Please try again." });
        return;
      }

      await refreshUser();
      toast.success("Your Floramade account is ready.");
      router.replace(redirectUrl);
    } catch {
      setErrors({ form: "We couldn’t reach the server. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Too short", "Getting stronger", "Strong password"][strength];
  const strengthColor = ["", "bg-rose-400", "bg-[#D9A441]", "bg-[#D9A441]"][strength];

  return (
    <section className="relative isolate flex min-h-[calc(100svh-92px)] items-center overflow-hidden bg-[#F7F9FC] px-4 py-10 sm:px-6 lg:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-[#D9E5F3]/60 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 right-0 h-96 w-96 rounded-full bg-[#E7EFD8]/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm text-[#1A2332] transition hover:text-[#142B49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]">
          <ArrowLeft size={16} aria-hidden="true" /> Back to shop
        </Link>

        <div className="grid overflow-hidden rounded-[2rem] border border-[#C5D5E8] bg-[#FFFFFF] shadow-[0_24px_80px_-38px_rgba(20,43,73,0.15)] md:min-h-[680px] md:grid-cols-[0.82fr_1.18fr]">
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#142B49] p-10 text-white md:flex lg:p-12">
            <div aria-hidden="true" className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10" />
            <div aria-hidden="true" className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full border border-white/10" />

            <div className="relative z-10 flex items-center gap-3">
              <Image src="/floramade-icon.png" alt="" width={56} height={56} className="rounded-full ring-1 ring-[#D9A441]/60" />
              <div>
                <p className="font-display text-lg tracking-wide">Floramade</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">Ayurvedic wellness</p>
              </div>
            </div>

            <div className="relative z-10 my-12">
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D9A441]/45 bg-[#D9A441]/10 text-[#D9A441]">
                <Leaf size={20} aria-hidden="true" />
              </span>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#D9A441]">Begin with balance</p>
              <h2 className="max-w-sm text-4xl leading-[1.12] tracking-[-0.04em] lg:text-[2.8rem]">Small rituals. A more mindful you.</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
                Create an account to keep your orders, delivery details, and everyday wellness in one place.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-xs text-white/55">
              <ShieldCheck size={16} className="text-[#D9A441]" aria-hidden="true" />
              Your account details stay protected.
            </div>
          </aside>

          <div className="flex items-center px-6 py-9 sm:px-10 md:px-12 lg:px-16">
            <div className="mx-auto w-full max-w-lg">
              <div className="mb-7 md:mb-8">
                <div className="mb-5 flex items-center gap-3 md:hidden">
                  <Image src="/floramade-icon.png" alt="" width={42} height={42} className="rounded-full" />
                  <span className="font-display text-lg text-[#142B49]">Floramade</span>
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D9A441]">A little care goes a long way</p>
                <h1 className="font-display text-3xl text-[#1A2332] sm:text-4xl">Create your account</h1>
                <p className="mt-3 text-sm leading-6 text-[#1A2332]">Join Floramade and start your wellness journey.</p>
              </div>

              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-[#1A2332]">Full name</label>
                  <div className={`flex h-[3.15rem] items-center gap-3 rounded-xl border bg-[#FFFFFF] px-4 transition focus-within:ring-4 ${errors.name ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#D9A441] focus-within:ring-[#D9E5F3]"}`}>
                    <UserRound size={18} className="shrink-0 text-[#142B49]" aria-hidden="true" />
                    <input id="register-name" name="name" type="text" autoComplete="name" required maxLength={80} value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your full name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "register-name-error" : undefined} className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1A2332] outline-none placeholder:text-[#8E9AA8]" />
                  </div>
                  {errors.name && <p id="register-name-error" className="mt-1.5 text-xs text-rose-700">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-[#1A2332]">Email address</label>
                  <div className={`flex h-[3.15rem] items-center gap-3 rounded-xl border bg-[#FFFFFF] px-4 transition focus-within:ring-4 ${errors.email ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#D9A441] focus-within:ring-[#D9E5F3]"}`}>
                    <Mail size={18} className="shrink-0 text-[#142B49]" aria-hidden="true" />
                    <input id="register-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck="false" required value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "register-email-error" : undefined} className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1A2332] outline-none placeholder:text-[#8E9AA8]" />
                  </div>
                  {errors.email && <p id="register-email-error" className="mt-1.5 text-xs text-rose-700">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="register-phone" className="mb-2 block text-sm font-medium text-[#1A2332]">Mobile number</label>
                  <div className={`flex h-[3.15rem] items-center gap-3 rounded-xl border bg-[#FFFFFF] px-4 transition focus-within:ring-4 ${errors.phone ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#D9A441] focus-within:ring-[#D9E5F3]"}`}>
                    <Phone size={18} className="shrink-0 text-[#142B49]" aria-hidden="true" />
                    <span className="border-r border-[#C5D5E8] pr-3 text-sm font-medium text-[#1A2332]">+91</span>
                    <input id="register-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" required maxLength={10} value={form.phone} onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit number" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "register-phone-error" : "register-phone-hint"} className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1A2332] outline-none placeholder:text-[#8E9AA8]" />
                  </div>
                  {errors.phone ? <p id="register-phone-error" className="mt-1.5 text-xs text-rose-700">{errors.phone}</p> : <p id="register-phone-hint" className="mt-1.5 text-[11px] text-[#8E9AA8]">We’ll use this for delivery updates.</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-[#1A2332]">Password</label>
                    <div className={`flex h-[3.15rem] items-center gap-2 rounded-xl border bg-[#FFFFFF] px-3 transition focus-within:ring-4 ${errors.password ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#D9A441] focus-within:ring-[#D9E5F3]"}`}>
                      <LockKeyhole size={17} className="shrink-0 text-[#142B49]" aria-hidden="true" />
                      <input id="register-password" name="new-password" type={showPassword ? "text" : "password"} autoComplete="new-password" required value={form.password} onChange={(event) => updateField("password", event.target.value)} placeholder="At least 6 characters" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "register-password-error" : "password-strength-label"} className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1A2332] outline-none placeholder:text-[#8E9AA8]" />
                      <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="rounded-md p-1 text-[#142B49] transition hover:text-[#142B49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]">
                        {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                      </button>
                    </div>
                    {errors.password ? <p id="register-password-error" className="mt-1.5 text-xs text-rose-700">{errors.password}</p> : (
                      <div className="mt-2" aria-live="polite">
                        <div className="flex gap-1" aria-hidden="true">{[1, 2, 3].map((step) => <span key={step} className={`h-1 flex-1 rounded-full ${strength >= step ? strengthColor : "bg-[#C5D5E8]"}`} />)}</div>
                        {strength > 0 && <p id="password-strength-label" className="mt-1 text-[10px] text-[#8E9AA8]">{strengthLabel}</p>}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="register-confirm-password" className="mb-2 block text-sm font-medium text-[#1A2332]">Confirm password</label>
                    <div className={`flex h-[3.15rem] items-center gap-2 rounded-xl border bg-[#FFFFFF] px-3 transition focus-within:ring-4 ${errors.confirmPassword ? "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-100" : "border-[#C5D5E8] focus-within:border-[#D9A441] focus-within:ring-[#D9E5F3]"}`}>
                      <LockKeyhole size={17} className="shrink-0 text-[#142B49]" aria-hidden="true" />
                      <input id="register-confirm-password" name="confirm-password" type={showConfirmation ? "text" : "password"} autoComplete="new-password" required value={form.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} placeholder="Repeat password" aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined} className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-[#1A2332] outline-none placeholder:text-[#8E9AA8]" />
                      <button type="button" onClick={() => setShowConfirmation((visible) => !visible)} aria-label={showConfirmation ? "Hide confirmation password" : "Show confirmation password"} className="rounded-md p-1 text-[#142B49] transition hover:text-[#142B49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]">
                        {showConfirmation ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p id="register-confirm-error" className="mt-1.5 text-xs text-rose-700">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#C5D5E8] bg-[#FFFFFF] px-4 py-3 text-xs leading-5 text-[#1A2332] transition hover:border-[#D9A441]/50">
                  <input type="checkbox" checked={form.marketingConsent} onChange={(event) => updateField("marketingConsent", event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#D9A441]" />
                  <span>Send me occasional product news and wellness tips. You can unsubscribe anytime.</span>
                </label>

                {errors.form && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-800">{errors.form}</p>}

                <button type="submit" disabled={loading} className="group flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-[#142B49] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(20,43,73,0.5)] transition hover:bg-[#0E1F36] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D9E5F3] disabled:cursor-not-allowed disabled:opacity-65">
                  {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />Creating your account…</> : <>Create account <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></>}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#1A2332]">
                Already registered?{" "}
                <Link href={`/login${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`} className="font-semibold text-[#D9A441] underline-offset-4 transition hover:text-[#142B49] hover:text-[#C48F2E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]">Sign in</Link>
              </p>
              <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#8E9AA8]">
                <ShieldCheck size={14} aria-hidden="true" /> Your details are used to manage your account and deliveries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
