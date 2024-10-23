import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  // read dotenv variables SUPABASE_URL and KEY
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string
);
