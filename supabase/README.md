# Supabase setup

1. In the Supabase SQL Editor for project `gcxfqnqewpfypocphmml`, run `migrations/202610290001_initial_floramade.sql`. It creates empty tables; no records are seeded.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and the server-only `SUPABASE_SECRET_KEY` to `.env.local`. Keep `JWT_SECRET` set as well for the website's HTTP-only session cookie.
3. Start the app with `npm run dev`. The app starts with no products or users. Register the first account, then promote it to admin in the SQL Editor with `update public.users set data = jsonb_set(data, '{role}', '"admin"'::jsonb, true) where email = 'your-admin-email@example.com';`.

The website accesses `products`, `users`, `orders`, and `inquiries` from trusted server code with the Supabase secret key. RLS is enabled and no browser access policies are created. Do not rename the secret to a `NEXT_PUBLIC_` variable. The Supabase MCP server is for Codex's project access and is configured separately; its MCP URL or OAuth token should not be placed in the app's `.env.local`.
