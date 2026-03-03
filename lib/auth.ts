import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import { createServerClient as _createServerClient } from "@supabase/ssr";
import type { CookieMethodsServer } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createBrowserClient() {
  return _createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function createServerClient(cookieStore: CookieMethodsServer) {
  return _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: cookieStore,
  });
}
