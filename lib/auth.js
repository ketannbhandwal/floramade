import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";

function jwtSecret() {
  if (!process.env.JWT_SECRET) throw new Error("Set JWT_SECRET in .env.local.");
  return process.env.JWT_SECRET;
}

export function signToken(payload) {
  return jwt.sign(payload, jwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret());
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const tokenUser = verifyToken(token);
  if (!tokenUser?.id) return null;

  // Roles can change after a token is issued. Use the current Supabase profile
  // as the source of truth so an old JWT cannot block or preserve admin access.
  const profile = await User.findById(tokenUser.id);
  if (!profile) return null;

  return {
    ...tokenUser,
    id: String(profile._id),
    email: profile.email || tokenUser.email,
    name: profile.name || tokenUser.name,
    role: profile.role,
  };
}
