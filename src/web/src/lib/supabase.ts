import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://bfvzbalgupivvoohbuor.supabase.co";
const key = process.env.SUPABASE_SERVICE_KEY ?? "";

// Lazy singleton — avoids crashing during build/static generation
let _client: SupabaseClient | null = null;
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_client) _client = createClient(url, key);
    return (_client as any)[prop];
  },
});
