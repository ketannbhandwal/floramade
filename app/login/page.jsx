"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { refreshUser } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = "Enter a valid email";
    if (form.password.length < 6) nextErrors.password = "Minimum 6 characters";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message);
    await refreshUser();
    toast.success("Welcome back");
    router.push("/");
  }

  return (
    <div className="w-full pt-32 md:pt-40 pb-20 px-6">
      <div className="mx-auto max-w-md rounded-[2rem] border border-border bg-white/50 backdrop-blur-sm p-8 shadow-sm">
      <h1 className="font-display mb-2 text-3xl text-[#3f2c22]">Welcome Back</h1>
      <p className="mb-5 text-sm text-[#6d5648]">Login to track orders and manage your account.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Email" error={errors.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" error={errors.password} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button className="w-full" size="lg" type="submit">Login</Button>
      </form>
      <p className="mt-4 text-sm text-[#6d5648]">
        New customer? <Link href="/register" className="font-medium underline">Create account</Link>
      </p>
      <p className="mt-2 text-xs text-[#8b6e56]">Admin demo: admin@fiveetatva.com / admin123</p>
      </div>
    </div>
  );
}
