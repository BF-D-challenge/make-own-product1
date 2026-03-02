import { NextRequest, NextResponse } from "next/server";
import { generateAndSendSMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workflowId, recipientPhone, messagePrompt } = body;

    if (!workflowId || !recipientPhone || !messagePrompt) {
      return NextResponse.json(
        { error: "Missing required fields: workflowId, recipientPhone, messagePrompt" },
        { status: 400 }
      );
    }

    const result = await generateAndSendSMS({
      workflowId,
      recipientPhone,
      messagePrompt,
    });

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[POST /api/send-sms]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
