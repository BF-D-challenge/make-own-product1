import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// ── iMessage via AppleScript ─────────────────────────────────────────────────
// Works only on macOS with Messages.app signed into iMessage.

function escapeAppleScript(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export async function sendIMessage(to: string, body: string): Promise<void> {
  const script = [
    'tell application "Messages"',
    "  set targetService to 1st account whose service type = iMessage",
    `  set targetBuddy to participant "${escapeAppleScript(to)}" of targetService`,
    `  send "${escapeAppleScript(body)}" to targetBuddy`,
    "end tell",
  ].join("\n");

  await execFileAsync("osascript", ["-e", script]);
}

export function isIMessageAvailable(): boolean {
  return process.platform === "darwin";
}
