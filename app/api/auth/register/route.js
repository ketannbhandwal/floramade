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
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json({ message: "Phone must be 10 digits" }, { status: 400 });
    }

      const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const { data: authData, error: authError } = await getSupabaseAdmin().auth.admin.createUser({
      email: email.toLowerCase(), password, email_confirm: true, user_metadata: { name, phone },
    });
    if (authError) return NextResponse.json({ message: authError.message }, { status: 400 });
    let user;
    try {
      user = await User.create({ _id: authData.user.id, name, email: email.toLowerCase(), phone, marketingConsent: Boolean(marketingConsent), role: "user" });
    } catch (profileError) {
      await getSupabaseAdmin().auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }
    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });

    const res = NextResponse.json({ message: "Registered", user: { name: user.name, email, phone: user.phone, role: user.role } });
    res.cookies.set("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
    return res;
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
