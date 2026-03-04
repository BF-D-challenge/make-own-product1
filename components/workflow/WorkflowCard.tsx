"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Clock,
  Calendar,
  MessageSquare,
  Phone,
  Pencil,
  Trash2,
  CalendarClock,
  Send,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { Workflow, TriggerType } from "@/lib/supabase";

const DAY_LABELS: Record<string, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu",
  fri: "Fri", sat: "Sat", sun: "Sun",
};

function formatTime(time?: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function triggerSummary(type: TriggerType, config: Workflow["trigger_config"]): string {
  switch (type) {
    case "daily":
      return `Every day${config.time ? ` at ${formatTime(config.time)}` : ""}`;
    case "weekly": {
      const days = (config.days ?? []).map((d) => DAY_LABELS[d] ?? d).join(", ");
      return `Every ${days || "week"}${config.time ? ` at ${formatTime(config.time)}` : ""}`;
    }
    case "specific_time":
      return config.time ? `At ${formatTime(config.time)}` : "Specific time";
    case "inactivity":
      return `If no chat in ${config.inactivityDays ?? "?"} days`;
    default:
      return "Unknown trigger";
  }
}

function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "Never sent";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const TRIGGER_ICONS: Record<TriggerType, React.ReactNode> = {
  daily: <Clock size={14} />,
  weekly: <Calendar size={14} />,
  specific_time: <CalendarClock size={14} />,
  inactivity: <MessageSquare size={14} />,
};

interface WorkflowCardProps {
  workflow: Workflow;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (workflow: Workflow) => void;
  onDelete: (id: string) => void;
}

export function WorkflowCard({
  workflow,
  onToggle,
  onEdit,
  onDelete,
}: WorkflowCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<"success" | "error" | null>(null);

  const summary = triggerSummary(workflow.trigger_type, workflow.trigger_config);

  async function handleSendNow() {
    if (sending || workflow.recipients.length === 0) return;
    setSending(true);
    setSendResult(null);
    let allSuccess = true;
    for (const phone of workflow.recipients) {
      const res = await fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: workflow.id,
          recipientPhone: phone,
          messagePrompt: workflow.message_prompt,
        }),
      });
      if (!res.ok) allSuccess = false;
    }
    setSendResult(allSuccess ? "success" : "error");
    setSending(false);
    setTimeout(() => setSendResult(null), 4000);
  }

  return (
    <div
      className="rounded-2xl border p-4 transition-all duration-200"
      style={{
        background: "rgba(224,242,254,0.5)",
        borderColor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow:
          "0 2px 12px rgba(148,163,184,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {/* Top row — trigger + status badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-sky-600 font-medium text-sm">
          {TRIGGER_ICONS[workflow.trigger_type]}
          <span>{summary}</span>
        </div>
        <Badge
          variant="secondary"
          className={`text-xs shrink-0 font-semibold px-2 py-0.5 rounded-full border-0 ${
            workflow.is_active
              ? "bg-sky-100 text-sky-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {workflow.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Message prompt preview */}
      <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">
        <MessageSquare size={13} className="inline mr-1 opacity-50" />
        {workflow.message_prompt || (
          <span className="italic text-slate-400">No prompt set</span>
        )}
      </p>

      {/* Recipients */}
      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
        <Phone size={12} className="shrink-0" />
        <span className="truncate">
          {workflow.recipients.length === 0
            ? "No recipients"
            : workflow.recipients.length === 1
            ? workflow.recipients[0]
            : `${workflow.recipients[0]} +${workflow.recipients.length - 1} more`}
        </span>
      </div>

      {/* Bottom row — last sent + toggle + actions */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/50">
        <span className="text-xs text-slate-400">
          {formatRelativeTime(workflow.last_sent_at)}
        </span>

        <div className="flex items-center gap-3">
          {/* Send Now */}
          <button
            onClick={handleSendNow}
            disabled={sending || workflow.recipients.length === 0}
            className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
            style={{
              color: sendResult === "success" ? "#16a34a" : sendResult === "error" ? "#dc2626" : "#64748b",
            }}
            aria-label="Send now"
            title="Send now"
          >
            {sendResult === "success" ? (
              <CheckCircle2 size={14} />
            ) : sendResult === "error" ? (
              <XCircle size={14} />
            ) : (
              <Send size={14} className={sending ? "animate-pulse" : ""} />
            )}
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(workflow)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
            aria-label="Edit workflow"
          >
            <Pencil size={14} />
          </button>

          {/* Delete with confirm */}
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(workflow.id)}
                className="text-xs font-semibold text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Delete workflow"
            >
              <Trash2 size={14} />
            </button>
          )}

          {/* Active toggle */}
          <Switch
            checked={workflow.is_active}
            onCheckedChange={(checked) => onToggle(workflow.id, checked)}
            className="data-[state=checked]:bg-sky-500"
          />
        </div>
      </div>
    </div>
  );
}
