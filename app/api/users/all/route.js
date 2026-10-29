import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import User from "@/models/User";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const users = await User.find().select("name email phone role createdAt").sort({ createdAt: -1 });
  return NextResponse.json({ users });
}
