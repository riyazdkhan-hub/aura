import { createEnquiry, findRecentEnquiry } from "@/lib/enquiries";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(18),
  locality: z.string().trim().min(2).max(120),
  interest: z.enum(["Interior decoration", "Kitchen work", "Furniture", "Not sure yet"]),
  budget: z.enum(["", "Need guidance", "Under ₹2 lakh", "₹2–5 lakh", "₹5–10 lakh", "₹10 lakh+"]).default(""),
  details: z.string().trim().max(2000).default(""),
  consent: z.literal(true),
  website: z.string().max(500).optional(),
});

const headers = { "Cache-Control": "no-store" };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers });

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > 12000) return json({ error: "Your message is too long." }, 413);
  try {
    const raw = await request.text();
    if (raw.length > 12000) return json({ error: "Your message is too long." }, 413);
    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) return json({ error: "Please check your name, location, requirement and contact consent." }, 400);
    const data = parsed.data;
    if (data.website) return json({ error: "Your enquiry could not be accepted. Please call Aura." }, 400);
    let phone = data.phone.replace(/[^0-9]/g, "");
    if (phone.length === 12 && phone.startsWith("91")) phone = phone.slice(2);
    if (phone.length === 11 && phone.startsWith("0")) phone = phone.slice(1);
    if (!/^[6-9]\d{9}$/.test(phone)) return json({ error: "Please enter a valid 10-digit Indian mobile number, optionally with +91." }, 400);
    const now = Date.now();
    if (await findRecentEnquiry(phone, now - 300000)) {
      return json({ error: "An enquiry from this number was received recently. Please wait five minutes or call us directly." }, 429);
    }
    const id = "AU-" + crypto.randomUUID().slice(0, 8).toUpperCase();
    await createEnquiry({ id, name: data.name, phone, locality: data.locality, interest: data.interest, budget: data.budget, details: data.details, consent: true, created_at: now });
    return json({ reference: id }, 201);
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: "Invalid enquiry. Please refresh and try again." }, 400);
    console.error("Enquiry storage failed", error instanceof Error ? error.message : "unknown");
    return json({ error: "Your enquiry could not be saved right now. Try again or call +91 97695 60246." }, 503);
  }
}
