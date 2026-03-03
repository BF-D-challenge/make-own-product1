"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowCard } from "@/components/workflow/WorkflowCard";
import { WorkflowModal } from "@/components/workflow/WorkflowModal";
import {
  getWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  isSupabaseConfigured,
  type Workflow,
} from "@/lib/supabase";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-20 px-8 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: "rgba(224,242,254,0.7)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        <Zap size={28} className="text-sky-400" />
      </div>
      <h2 className="text-slate-700 font-semibold text-lg mb-2">No workflows yet</h2>
      <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-7">
        Workflows send AI-generated texts automatically. Create your first one to get started.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
          boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
        }}
      >
        <Plus size={16} />
        Add your first workflow
      </button>
    </div>
  );
}

// ── Error / missing config banner ────────────────────────────────────────────
function ConfigBanner() {
  return (
    <div className="mx-4 mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
      <p className="font-semibold mb-0.5">Supabase not configured</p>
      <p className="text-amber-600 text-xs">
        Set <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
        <code className="font-mono">.env.local</code> to load real data.
      </p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function WorkflowPage() {
  const { user } = useAuth();
  const userId = user?.id ?? "demo-user";
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const supabaseReady = isSupabaseConfigured;

  const fetchWorkflows = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setWorkflows(SAMPLE_WORKFLOWS);
      return;
    }
    try {
      const data = await getWorkflows(userId);
      setWorkflows(data);
    } catch {
      // silently fall back to empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  async function handleSave(
    data: Omit<Workflow, "id" | "created_at" | "user_id" | "last_sent_at">
  ) {
    setSaving(true);
    try {
      if (editingWorkflow) {
        const updated = supabaseReady
          ? await updateWorkflow(editingWorkflow.id, data)
          : { ...editingWorkflow, ...data };
        setWorkflows((prev) =>
          prev.map((w) => (w.id === editingWorkflow.id ? updated : w))
        );
      } else {
        if (supabaseReady) {
          const created = await createWorkflow({
            ...data,
            user_id: userId,
          });
          setWorkflows((prev) => [created, ...prev]);
        } else {
          const mock: Workflow = {
            ...data,
            id: crypto.randomUUID(),
            user_id: userId,
            created_at: new Date().toISOString(),
            last_sent_at: null,
          };
          setWorkflows((prev) => [mock, ...prev]);
        }
      }
      setModalOpen(false);
      setEditingWorkflow(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, is_active: isActive } : w))
    );
    if (supabaseReady) {
      await updateWorkflow(id, { is_active: isActive }).catch(() => {
        // revert on error
        setWorkflows((prev) =>
          prev.map((w) => (w.id === id ? { ...w, is_active: !isActive } : w))
        );
      });
    }
  }

  async function handleDelete(id: string) {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
    if (supabaseReady) {
      await deleteWorkflow(id).catch(() => fetchWorkflows());
    }
  }

  function openAdd() {
    setEditingWorkflow(null);
    setModalOpen(true);
  }

  function openEdit(workflow: Workflow) {
    setEditingWorkflow(workflow);
    setModalOpen(true);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: "#e0f2fe" }}
    >
      {/* Noise overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.025,
          mixBlendMode: "overlay",
        }}
      />

      {/* Card container */}
      <div
        className="relative w-full max-w-md flex flex-col md:rounded-3xl md:overflow-hidden"
        style={{
          minHeight: "100svh",
          backgroundColor: "#e0f2fe",
          boxShadow:
            "0 0 0 1px rgba(148,163,184,0.08), 0 32px 80px rgba(14,165,233,0.12), 0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-14 pb-4 md:pt-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-white/50 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
                Automations
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {workflows.length} workflow{workflows.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <Button
            onClick={openAdd}
            size="sm"
            className="rounded-2xl bg-sky-500 hover:bg-sky-600 text-white border-0 shadow-sm gap-1.5 px-4"
          >
            <Plus size={15} />
            Add
          </Button>
        </div>

        {/* ── Config warning ── */}
        {!supabaseReady && <ConfigBanner />}

        {/* ── Content ── */}
        <div className="flex-1 flex flex-col">
          {loading ? (
            // Skeleton
            <div className="px-4 pt-2 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-2xl animate-pulse"
                  style={{ background: "rgba(186,230,253,0.4)" }}
                />
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div className="px-4 pt-2 pb-10 space-y-3">
              {workflows.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  workflow={workflow}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      <WorkflowModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingWorkflow(null);
        }}
        onSave={handleSave}
        editingWorkflow={editingWorkflow}
        loading={saving}
      />
    </div>
  );
}

// ── Sample data (shown when Supabase is not configured) ──────────────────────
const SAMPLE_WORKFLOWS: Workflow[] = [
  {
    id: "sample-1",
    user_id: "demo-user",
    trigger_type: "daily",
    trigger_config: { time: "09:00" },
    message_prompt:
      "Generate a warm, personalized good morning message for my best friend. Keep it short, casual, and uplifting.",
    recipients: ["+1 (555) 010-2030"],
    is_active: true,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    last_sent_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "sample-2",
    user_id: "demo-user",
    trigger_type: "weekly",
    trigger_config: { time: "10:00", days: ["mon", "wed", "fri"] },
    message_prompt:
      "Write a motivational check-in message. Ask how their week is going and offer encouragement.",
    recipients: ["+1 (555) 040-5060", "+1 (555) 070-8090"],
    is_active: false,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    last_sent_at: null,
  },
  {
    id: "sample-3",
    user_id: "demo-user",
    trigger_type: "inactivity",
    trigger_config: { inactivityDays: 3 },
    message_prompt:
      "Hey, it's been a few days since we chatted. Generate a friendly nudge to reconnect.",
    recipients: ["+1 (555) 010-2030"],
    is_active: true,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    last_sent_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];
