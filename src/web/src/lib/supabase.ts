import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://bfvzbalgupivvoohbuor.supabase.co";
// Service key for server-side writes — this is safe because this file is only used server-side
const key = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmdnpiYWxndXBpdnZvb2hidW9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDIwNjY0NCwiZXhwIjoyMDg5NzgyNjQ0fQ.wH21PNgkZ2RpMS_O5quM6BrR38wHjbz1ijpOYtt8iA4";

// Lazy singleton — avoids crashing during build/static generation
let _client: SupabaseClient | null = null;
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_client) _client = createClient(url, key);
    return (_client as any)[prop];
  },
});
