import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import User from "@/models/User";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PUT(req) {
  const tokenUser = await getCurrentUser();
  if (!tokenUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ message: "Invalid password input" }, { status: 400 });
  }

  const user = await User.findById(tokenUser.id);
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  const { error: signInError } = await getSupabaseAdmin().auth.signInWithPassword({ email: user.email, password: currentPassword });
  if (signInError) return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
  const { error } = await getSupabaseAdmin().auth.admin.updateUserById(user.id, { password: newPassword });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ message: "Password updated" });
}
