"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import type { Workflow, TriggerType } from "@/lib/supabase";

const DAYS = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

interface FormState {
  trigger_type: TriggerType;
  time: string;
  days: string[];
  inactivityDays: string;
  message_prompt: string;
  phoneInput: string;
  recipients: string[];
  is_active: boolean;
}

const DEFAULT_FORM: FormState = {
  trigger_type: "daily",
  time: "09:00",
  days: [],
  inactivityDays: "3",
  message_prompt: "",
  phoneInput: "",
  recipients: [],
  is_active: true,
};

function workflowToForm(w: Workflow): FormState {
  return {
    trigger_type: w.trigger_type,
    time: w.trigger_config.time ?? "09:00",
    days: w.trigger_config.days ?? [],
    inactivityDays: String(w.trigger_config.inactivityDays ?? 3),
    message_prompt: w.message_prompt,
    phoneInput: "",
    recipients: w.recipients,
    is_active: w.is_active,
  };
}

interface WorkflowModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Workflow, "id" | "created_at" | "user_id" | "last_sent_at">) => void;
  editingWorkflow?: Workflow | null;
  loading?: boolean;
}

export function WorkflowModal({
  open,
  onClose,
  onSave,
  editingWorkflow,
  loading,
}: WorkflowModalProps) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  useEffect(() => {
    if (open) {
      setForm(editingWorkflow ? workflowToForm(editingWorkflow) : DEFAULT_FORM);
    }
  }, [open, editingWorkflow]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleDay(day: string) {
    set(
      "days",
      form.days.includes(day)
        ? form.days.filter((d) => d !== day)
        : [...form.days, day]
    );
  }

  function addRecipient() {
    const phone = form.phoneInput.trim();
    if (!phone || form.recipients.includes(phone)) return;
    set("recipients", [...form.recipients, phone]);
    set("phoneInput", "");
  }

  function removeRecipient(phone: string) {
    set("recipients", form.recipients.filter((r) => r !== phone));
  }

  function handleSubmit() {
    const trigger_config: Workflow["trigger_config"] = {};
    if (form.trigger_type !== "inactivity") {
      trigger_config.time = form.time;
    }
    if (form.trigger_type === "weekly") {
      trigger_config.days = form.days;
    }
    if (form.trigger_type === "inactivity") {
      trigger_config.inactivityDays = parseInt(form.inactivityDays, 10) || 3;
    }

    onSave({
      trigger_type: form.trigger_type,
      trigger_config,
      message_prompt: form.message_prompt,
      recipients: form.recipients,
      is_active: form.is_active,
    });
  }

  const isValid =
    form.message_prompt.trim().length > 0 &&
    form.recipients.length > 0 &&
    (form.trigger_type !== "weekly" || form.days.length > 0);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="w-full max-w-md rounded-3xl border-0 p-0 overflow-hidden"
        style={{
          background: "rgba(240,249,255,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 24px 64px rgba(14,165,233,0.15), 0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-slate-800 font-bold text-lg tracking-tight">
            {editingWorkflow ? "Edit Workflow" : "New Workflow"}
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[70vh]">

          {/* Trigger type */}
          <div className="space-y-1.5">
            <Label className="text-slate-600 text-sm font-medium">Trigger</Label>
            <Select
              value={form.trigger_type}
              onValueChange={(v) => set("trigger_type", v as TriggerType)}
            >
              <SelectTrigger className="rounded-xl border-white/60 bg-white/70 text-slate-700 focus:ring-sky-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/60">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="specific_time">Specific time</SelectItem>
                <SelectItem value="inactivity">User hasn't chatted in X days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time picker — shown for all except inactivity */}
          {form.trigger_type !== "inactivity" && (
            <div className="space-y-1.5">
              <Label className="text-slate-600 text-sm font-medium">Time</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                className="rounded-xl border-white/60 bg-white/70 text-slate-700 focus-visible:ring-sky-400"
              />
            </div>
          )}

          {/* Day picker — shown for weekly only */}
          {form.trigger_type === "weekly" && (
            <div className="space-y-1.5">
              <Label className="text-slate-600 text-sm font-medium">Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      form.days.includes(day.value)
                        ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                        : "bg-white/70 text-slate-600 border-white/60 hover:border-sky-300"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inactivity days — shown for inactivity only */}
          {form.trigger_type === "inactivity" && (
            <div className="space-y-1.5">
              <Label className="text-slate-600 text-sm font-medium">
                Trigger after X days of inactivity
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="90"
                  value={form.inactivityDays}
                  onChange={(e) => set("inactivityDays", e.target.value)}
                  className="w-24 rounded-xl border-white/60 bg-white/70 text-slate-700 focus-visible:ring-sky-400"
                />
                <span className="text-slate-500 text-sm">days</span>
              </div>
            </div>
          )}

          {/* Message prompt */}
          <div className="space-y-1.5">
            <Label className="text-slate-600 text-sm font-medium">AI Message Prompt</Label>
            <Textarea
              placeholder="e.g. Generate a warm, personalized morning greeting for my best friend. Keep it short, casual, and uplifting."
              value={form.message_prompt}
              onChange={(e) => set("message_prompt", e.target.value)}
              rows={4}
              className="rounded-xl border-white/60 bg-white/70 text-slate-700 resize-none focus-visible:ring-sky-400 placeholder:text-slate-400"
            />
          </div>

          {/* Phone numbers */}
          <div className="space-y-1.5">
            <Label className="text-slate-600 text-sm font-medium">Recipients</Label>

            {/* Existing recipients */}
            {form.recipients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.recipients.map((phone) => (
                  <span
                    key={phone}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-medium"
                  >
                    {phone}
                    <button
                      type="button"
                      onClick={() => removeRecipient(phone)}
                      className="text-sky-500 hover:text-sky-700 ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add phone input */}
            <div className="flex gap-2">
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phoneInput}
                onChange={(e) => set("phoneInput", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRecipient())}
                className="rounded-xl border-white/60 bg-white/70 text-slate-700 focus-visible:ring-sky-400 placeholder:text-slate-400"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={addRecipient}
                className="rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-600 border-0 shrink-0"
              >
                <Plus size={16} />
              </Button>
            </div>
            <p className="text-xs text-slate-400">Press Enter or + to add each number</p>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-slate-700 text-sm font-medium">Active</p>
              <p className="text-slate-400 text-xs">Start sending messages immediately</p>
            </div>
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => set("is_active", v)}
              className="data-[state=checked]:bg-sky-500"
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-6 pt-2 gap-2 sm:gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="flex-1 rounded-xl bg-sky-500 hover:bg-sky-600 text-white border-0 shadow-sm disabled:opacity-50"
          >
            {loading ? "Saving…" : editingWorkflow ? "Save changes" : "Create workflow"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
