import { createClient } from "@supabase/supabase-js";

export type TriggerType = "daily" | "weekly" | "specific_time" | "inactivity";

export interface TriggerConfig {
  time?: string; // "HH:MM" — for daily, weekly, specific_time
  days?: string[]; // ["mon","tue",...] — for weekly
  inactivityDays?: number; // number of days — for inactivity
}

export interface Workflow {
  id: string;
  user_id: string;
  trigger_type: TriggerType;
  trigger_config: TriggerConfig;
  message_prompt: string;
  recipients: string[];
  is_active: boolean;
  created_at: string;
  last_sent_at?: string | null;
}

export type WorkflowInsert = Omit<Workflow, "id" | "created_at" | "last_sent_at">;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

// Only instantiate when env vars are present — prevents crash at module load
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ── CRUD helpers ────────────────────────────────────────────────────────────

export async function getWorkflows(userId: string): Promise<Workflow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createWorkflow(workflow: WorkflowInsert): Promise<Workflow> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("workflows")
    .insert(workflow)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateWorkflow(
  id: string,
  updates: Partial<WorkflowInsert>
): Promise<Workflow> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("workflows")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteWorkflow(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("workflows").delete().eq("id", id);
  if (error) throw error;
}
