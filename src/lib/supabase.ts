import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations that require elevated permissions
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
