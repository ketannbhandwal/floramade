import "server-only";
import { createClient } from "@supabase/supabase-js";

let client;

export function getSupabaseAdmin() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gcxfqnqewpfypocphmml.supabase.co";
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("Set SUPABASE_SECRET_KEY in .env.local (server only).");
  client = createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  return client;
}
