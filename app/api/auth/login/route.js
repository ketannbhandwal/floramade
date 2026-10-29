import { NextResponse } from "next/server";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }
      const { data: authData, error: authError } = await getSupabaseAdmin().auth.signInWithPassword({ email: email.toLowerCase(), password });
    if (authError || !authData.user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    const user = await User.findById(authData.user.id);
    if (!user) return NextResponse.json({ message: "Account profile not found" }, { status: 403 });

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    const res = NextResponse.json({
      message: "Logged in",
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
    res.cookies.set("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
    return res;
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
