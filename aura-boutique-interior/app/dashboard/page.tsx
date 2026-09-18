"use client";

import { FormEvent, useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  locality: string;
  interest: string;
  budget: string;
  details: string;
  created_at: number;
};

function apiUrl() {
  return "/api/admin/enquiries";
}

export default function Dashboard() {
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [state, setState] = useState<"locked" | "loading" | "ready" | "error">("locked");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("aura-desk-password");
    if (saved) {
      setPassword(saved);
      void load(saved);
    }
  }, []);

  async function load(value = password) {
    setState("loading");
    setMessage("");
    try {
      const response = await fetch(apiUrl(), { headers: { "x-aura-admin-password": value }, cache: "no-store" });
      const data = await response.json() as { enquiries?: Enquiry[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to open the enquiry desk.");
      sessionStorage.setItem("aura-desk-password", value);
      setRows(data.enquiries || []);
      setState("ready");
    } catch (error) {
      sessionStorage.removeItem("aura-desk-password");
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to open the enquiry desk.");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void load();
  }

  function signOut() {
    sessionStorage.removeItem("aura-desk-password");
    setPassword("");
    setRows([]);
    setMessage("");
    setState("locked");
  }

  function exportCsv() {
    const keys: (keyof Enquiry)[] = ["id", "name", "phone", "locality", "interest", "budget", "details", "created_at"];
    const cell = (value: unknown) => {
      let text = String(value ?? "");
      if (/^[=+@\-\t\r\n]/.test(text)) text = "'" + text;
      return '"' + text.replaceAll('"', '""') + '"';
    };
    const csv = [keys.join(","), ...rows.map(row => keys.map(key => cell(key === "created_at" ? new Date(row[key]).toISOString() : row[key])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aura-enquiries.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (state !== "ready") return <main className="section dashboard desk-login"><p className="eyebrow">AURA · PRIVATE ENQUIRY DESK</p><h1>Project enquiries</h1><form className="form-card" onSubmit={submit}><h2>Owner sign in</h2><p>Enter the private dashboard password to view customer enquiries.</p><div className="field"><label htmlFor="desk-password">Dashboard password</label><input id="desk-password" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></div>{message && <p className="form-error" role="alert">{message}</p>}<button className="button" disabled={state === "loading"} type="submit">{state === "loading" ? "Opening…" : "Open dashboard"}</button><a className="text-link" href="/">Back to website</a></form></main>;

  return <main className="section dashboard"><p className="eyebrow">AURA · PRIVATE ENQUIRY DESK</p><h1>Project enquiries</h1><p>Showing the latest 250 submissions.</p><div className="desk-actions"><button className="button" onClick={() => void load()}>Refresh</button><button className="button" onClick={exportCsv}>Export CSV</button><a className="text-link" href="/">View website</a><button className="text-link" onClick={signOut}>Sign out</button></div>{rows.length === 0 ? <div className="desk-empty"><h2>No enquiries yet.</h2><p>New project submissions will appear here.</p></div> : <Table><TableHeader><TableRow>{["Received", "Customer", "Requirement", "Budget", "Message", "Reference"].map(label => <TableHead key={label}>{label}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map(row => <TableRow key={row.id}><TableCell>{new Date(row.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</TableCell><TableCell><strong>{row.name}</strong><br/><a href={"tel:+91" + row.phone}>{row.phone}</a><br/>{row.locality}</TableCell><TableCell>{row.interest}</TableCell><TableCell>{row.budget || "Not specified"}</TableCell><TableCell className="desk-message">{row.details || "—"}</TableCell><TableCell>{row.id}</TableCell></TableRow>)}</TableBody></Table>}</main>;
}
