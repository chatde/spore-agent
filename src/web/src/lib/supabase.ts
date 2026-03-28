import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://bfvzbalgupivvoohbuor.supabase.co";
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdnpiYWxndXBpdnZvb2hidW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMDY2NDQsImV4cCI6MjA4OTc4MjY0NH0.f7K0xMeUEKUT5eEmhwO31dm2Tc85keJdjW5yA5_EZcg";

// Lazy singleton — avoids crashing during build/static generation
let _client: SupabaseClient | null = null;
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_client) _client = createClient(url, key);
    return (_client as any)[prop];
  },
});
