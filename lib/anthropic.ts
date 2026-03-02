import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate a personalized SMS message using Claude.
 * Keeps the output under 160 characters (1 SMS segment).
 */
export async function generateSMSMessage(prompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system:
      "You are a warm, friendly assistant writing a short personal text message. " +
      "Generate ONLY the message body — no quotes, no preamble, no explanation. " +
      "Keep it natural, genuine, and under 160 characters.",
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected Claude response type");
  return block.text.trim();
}
