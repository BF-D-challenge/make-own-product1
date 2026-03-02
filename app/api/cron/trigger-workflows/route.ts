import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateAndSendSMS } from "@/lib/sms";
import type { Workflow } from "@/lib/supabase";

// ── Supabase admin client (service role) ────────────────────────────────────
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

// ── Trigger logic ────────────────────────────────────────────────────────────
// Times stored as "HH:MM" UTC. Cron runs at 0 * * * * (top of every hour).
// KST = UTC+9, so a "09:00 KST" workflow stores "00:00" in UTC — adjust in UI later.

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function alreadySentRecently(workflow: Workflow, now: Date): boolean {
  if (!workflow.last_sent_at) return false;
  const last = new Date(workflow.last_sent_at);
  const hoursSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

  switch (workflow.trigger_type) {
    case "daily":
    case "specific_time":
      return hoursSince < 23; // don't re-send within same day
    case "weekly":
      return hoursSince < 167; // don't re-send within same week
    default:
      return false;
  }
}

function shouldTrigger(workflow: Workflow, now: Date): boolean {
  if (alreadySentRecently(workflow, now)) return false;

  const { trigger_type, trigger_config } = workflow;
  const currentHour = now.getUTCHours();

  switch (trigger_type) {
    case "daily": {
      if (!trigger_config.time) return false;
      const [h] = trigger_config.time.split(":").map(Number);
      return currentHour === h;
    }

    case "weekly": {
      if (!trigger_config.time || !trigger_config.days?.length) return false;
      const today = DAY_KEYS[now.getUTCDay()];
      if (!trigger_config.days.includes(today)) return false;
      const [h] = trigger_config.time.split(":").map(Number);
      return currentHour === h;
    }

    case "specific_time": {
      if (!trigger_config.time) return false;
      const [h] = trigger_config.time.split(":").map(Number);
      return currentHour === h;
    }

    case "inactivity": {
      // TODO: wire up once chat logs are available
      return false;
    }

    default:
      return false;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();

  // Fetch all active workflows
  const { data: workflows, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("[cron] Failed to fetch workflows:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: Array<{
    workflowId: string;
    recipient: string;
    success: boolean;
    error?: string;
  }> = [];

  for (const workflow of (workflows as Workflow[]) ?? []) {
    if (!shouldTrigger(workflow, now)) continue;

    for (const phone of workflow.recipients) {
      console.log(`[cron] Triggering workflow ${workflow.id} → ${phone}`);

      const result = await generateAndSendSMS({
        workflowId: workflow.id,
        recipientPhone: phone,
        messagePrompt: workflow.message_prompt,
      });

      results.push({
        workflowId: workflow.id,
        recipient: phone,
        success: result.success,
        error: result.error,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    triggered: results.length,
    timestamp: now.toISOString(),
    results,
  });
}
