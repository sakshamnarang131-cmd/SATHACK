import { createClient } from "@supabase/supabase-js";

// Sirf backend API routes (app/api/...) me use karna, frontend components me nahi
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);