import { NextResponse } from "next/server";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { name, email, phone, password, marketingConsent } = await req.json();
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();
    const cleanPhone = String(phone).trim().replace(/\D/g, "");

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      return NextResponse.json({ message: "Phone must be a valid 10-digit number" }, { status: 400 });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    const { data: authData, error: authError } = await getSupabaseAdmin().auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: { name: cleanName, phone: cleanPhone },
    });
    if (authError) {
      return NextResponse.json({ message: authError.message }, { status: 400 });
    }

    let user;
    try {
      user = await User.create({
        _id: authData.user.id,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        marketingConsent: Boolean(marketingConsent),
        role: "user",
      });
    } catch (profileError) {
      await getSupabaseAdmin().auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });

    const res = NextResponse.json({
      message: "Registered successfully",
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });

    const isHttps = req.headers.get("x-forwarded-proto") === "https" || req.url?.startsWith("https://");
    const isProduction = process.env.NODE_ENV === "production";
    const secure = isProduction && isHttps;

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: secure,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: error.message || "Failed to create account" }, { status: 500 });
  }
}
