# Aura Boutique Interior — Vercel and Netlify package

This is the complete portable Next.js website with:

- Phone number: `+91 97695 60246`
- Private dashboard: `/dashboard`
- Default dashboard password: `admin@123`
- Enquiry form, shared Supabase storage and CSV export
- Responsive gallery and scrolling business images

## 1. Create the database once

1. Create a free Supabase project at https://supabase.com.
2. Open **SQL Editor**, paste the contents of `supabase-setup.sql`, and run it.
3. Open **Project Settings → API** and copy:
   - Project URL
   - `service_role` secret key

The service-role key is server-only. Never put it in code or in a variable beginning with `NEXT_PUBLIC_`.

## 2. Deploy to Vercel

The recommended method is to upload this folder to a private GitHub repository and import that repository into Vercel.

Add these variables under **Project Settings → Environment Variables**:

```text
SUPABASE_URL=your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=your Supabase service-role key
ADMIN_PASSWORD=admin@123
```

Framework preset: **Next.js**. Build command and output settings can remain automatic. Redeploy after saving the variables.

## 3. Deploy to Netlify

Connect the same private GitHub repository to Netlify, or unzip this package and upload the project while signed in.

Add the same three variables under **Project configuration → Environment variables**. Netlify will use `pnpm build` from `netlify.toml` and detect Next.js automatically. Redeploy after saving the variables.

## 4. Open the dashboard

Visit `https://YOUR-DOMAIN/dashboard` and enter `admin@123`.

For a customer production website, change `ADMIN_PASSWORD` on both hosts to a strong unique password. If both deployments use the same Supabase project, enquiries from both websites appear in the same dashboard.

## Local test

Copy `.env.example` to `.env.local`, enter the Supabase values, then run:

```bash
pnpm install
pnpm dev
```
