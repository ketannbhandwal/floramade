import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = typeof password === "string" ? password.trim() : password;

    // Use a fresh isolated client to verify credentials so the singleton admin client is never mutated or degraded
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gcxfqnqewpfypocphmml.supabase.co";
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    const authClient = createClient(url, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });

    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (authError || !authData?.user) {
      return NextResponse.json({ message: "Invalid email or password. Please verify your credentials." }, { status: 401 });
    }

    // Retrieve profile with admin superuser permissions
    let user = await User.findById(authData.user.id);
    if (!user) {
      user = await User.findOne({ email: cleanEmail });
    }
    if (!user) {
      const meta = authData.user.user_metadata || {};
      user = await User.create({
        _id: authData.user.id,
        name: meta.name || cleanEmail.split("@")[0],
        email: cleanEmail,
        phone: meta.phone || "",
        role: "user",
        marketingConsent: false,
      });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    const res = NextResponse.json({
      message: "Logged in successfully",
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });

    // Detect HTTPS vs HTTP to ensure cookie is accepted on both localhost and production
    const isHttps = req.headers.get("x-forwarded-proto") === "https" || req.url?.startsWith("https://");
    const isProduction = process.env.NODE_ENV === "production";
    const secure = isProduction && isHttps;

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: secure,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: error.message || "Failed to log in" }, { status: 500 });
  }
}
