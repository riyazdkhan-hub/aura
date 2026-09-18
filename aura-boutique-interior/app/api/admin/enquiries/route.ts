import { getRawDb } from "@/db";
import { env } from "cloudflare:workers";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "x-aura-admin-password, Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "no-store",
};

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export async function GET(request: Request) {
  const supplied = request.headers.get("x-aura-admin-password") || "";
  const passwordHash = env.AURA_ADMIN_PASSWORD_HASH;
  if (!passwordHash) return Response.json({ error: "Dashboard access has not been configured." }, { status: 503, headers: cors });
  if (!supplied || await sha256(supplied) !== passwordHash) return Response.json({ error: "Incorrect dashboard password." }, { status: 401, headers: cors });
  try {
    const result = await getRawDb().prepare("SELECT id,name,phone,locality,interest,budget,details,created_at FROM enquiries ORDER BY created_at DESC LIMIT 250").all();
    return Response.json({ enquiries: result.results }, { headers: cors });
  } catch {
    return Response.json({ error: "Enquiries are unavailable right now. Please try again." }, { status: 503, headers: cors });
  }
}
