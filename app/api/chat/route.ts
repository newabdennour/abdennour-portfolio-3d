import { NextRequest } from "next/server";

const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = process.env.NVIDIA_MODEL ?? "nvidia/nemotron-3-ultra-550b-a55b";

export async function POST(req: NextRequest) {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) {
    return Response.json({ error: "Chat is not configured on this deployment." }, { status: 500 });
  }
  let body: { system?: string; messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const messages = (body.messages ?? [])
    .slice(-20)
    .map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, 4000),
    }));
  if (messages.length === 0 || messages.every((m) => !m.content.trim())) {
    return Response.json({ error: "Empty conversation." }, { status: 400 });
  }
  const upstream = await fetch(NVIDIA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      messages: body.system && String(body.system).trim()
        ? [{ role: "system", content: String(body.system).slice(0, 2000) }, ...messages]
        : messages,
      max_tokens: 1024,
      stream: true,
    }),
    signal: AbortSignal.timeout(60000),
  }).catch(() => null);
  if (!upstream || !upstream.ok || !upstream.body) {
    return Response.json({ error: "Model service unavailable. Try again." }, { status: 502 });
  }
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buf = "";
  const out = new ReadableStream({
    async start(ctrl) {
      const send = (obj: unknown) => ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const parts = buf.split("\n\n");
          buf = parts.pop() ?? "";
          for (const part of parts) {
            for (const line of part.split("\n")) {
              const t = line.trim();
              if (!t.startsWith("data:")) continue;
              const payload = t.slice(5).trim();
              if (payload === "[DONE]") continue;
              try {
                const j = JSON.parse(payload);
                const d = j.choices?.[0]?.delta ?? {};
                if (typeof d.reasoning_content === "string" && d.reasoning_content) {
                  send({ type: "thinking", delta: d.reasoning_content });
                }
                if (typeof d.content === "string" && d.content) {
                  send({ type: "text", delta: d.content });
                }
              } catch {
                /* skip partial chunk */
              }
            }
          }
        }
        send({ type: "done" });
      } catch {
        send({ type: "error", message: "Stream interrupted. Try again." });
      } finally {
        ctrl.close();
      }
    },
  });
  return new Response(out, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
