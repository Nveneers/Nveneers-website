// Server-only Supabase client.
// Uses the service_role key — NEVER import this in client components.
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type SubmissionStatus = "new" | "contacted" | "done";

export type Submission = {
  id: string;
  name: string;
  phone: string;
  photo_url: string;
  status: SubmissionStatus;
  created_at: string;
};
