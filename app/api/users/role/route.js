import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import User from "@/models/User";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(req) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { message: "User ID and role are required." },
        { status: 400 }
      );
    }

    if (role !== "admin" && role !== "user") {
      return NextResponse.json(
        { message: "Invalid role. Role must be 'admin' or 'user'." },
        { status: 400 }
      );
    }

    // Prevent admin from revoking their own admin access to avoid accidental lockout
    if (String(userId) === String(currentUser.id) && role !== "admin") {
      return NextResponse.json(
        { message: "You cannot revoke your own admin access." },
        { status: 400 }
      );
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const supabase = getSupabaseAdmin();
    const updatedData = { ...(targetUser.data || targetUser), role };
    delete updatedData._id;
    delete updatedData.id;
    delete updatedData.createdAt;
    delete updatedData.updatedAt;

    const { data, error } = await supabase
      .from("users")
      .update({
        data: updatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `User role successfully updated to ${role}.`,
      user: {
        id: data.id,
        _id: data.id,
        name: data.data?.name,
        email: data.email || data.data?.email,
        phone: data.data?.phone,
        role: data.data?.role,
      },
    });
  } catch (error) {
    console.error("Failed to update user role:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update role." },
      { status: 500 }
    );
  }
}

