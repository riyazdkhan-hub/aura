export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  locality: string;
  interest: string;
  budget: string;
  details: string;
  consent: boolean;
  created_at: number;
};

function configuration() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Database environment variables are not configured.");
  return { url, key };
}

async function request(path: string, init: RequestInit = {}) {
  const { url, key } = configuration();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase request failed", response.status, detail.slice(0, 300));
    throw new Error("Database request failed.");
  }
  return response;
}

export async function findRecentEnquiry(phone: string, after: number) {
  const query = `enquiries?select=id&phone=eq.${encodeURIComponent(phone)}&created_at=gt.${after}&limit=1`;
  const response = await request(query);
  const rows = await response.json() as Array<{ id: string }>;
  return rows[0] ?? null;
}

export async function createEnquiry(enquiry: Enquiry) {
  await request("enquiries", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(enquiry),
  });
}

export async function listEnquiries(limit = 250) {
  const fields = "id,name,phone,locality,interest,budget,details,created_at";
  const response = await request(`enquiries?select=${fields}&order=created_at.desc&limit=${limit}`);
  return response.json();
}
