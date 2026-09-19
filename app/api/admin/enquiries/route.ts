import { listEnquiries } from "@/lib/enquiries";

export const runtime = "nodejs";

const headers = { "Cache-Control": "no-store" };

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function GET(request: Request) {
  const supplied = request.headers.get("x-aura-admin-password") || "";
  const expected = process.env.ADMIN_PASSWORD || "admin@123";
  if (!supplied || await sha256(supplied) !== await sha256(expected)) {
    return Response.json({ error: "Incorrect dashboard password." }, { status: 401, headers });
  }
  try {
    return Response.json({ enquiries: await listEnquiries(250) }, { headers });
  } catch {
    return Response.json({ error: "Enquiries are unavailable. Check the database environment variables." }, { status: 503, headers });
  }
}
