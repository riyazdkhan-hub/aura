# Aura Boutique Interior — source handoff

This package contains the complete website source, including the original living-room hero, the scrolling project gallery, all public pages, enquiry form/API, private dashboard, CSV export, database schema and local migrations.

No passwords, API keys or private deployment tokens are included.

## Where form submissions are stored

The enquiry form sends data to `POST /api/enquiries`. In this production build, that API stores each submission in the Cloudflare D1 database bound as `DB`. The private `/dashboard` page reads the latest submissions from the same database and can export them as CSV in the browser.

## Run locally

Requirements: Node.js 22.13 or newer and pnpm 11.

1. Run `pnpm install`.
2. Run `pnpm dev`.
3. Open the local URL printed in the terminal.

For a local database, build the project and apply `drizzle/0000_orange_crystal.sql` to the local D1 binding as described in the main `README.md`.

## Dashboard setup

Set `AURA_ADMIN_PASSWORD_HASH` to the lowercase SHA-256 hash of the password you want the owner to use. Never commit the plain password. You can generate a hash with:

```sh
node -e "crypto.subtle.digest('SHA-256',new TextEncoder().encode(process.argv[1])).then(x=>console.log(Buffer.from(x).toString('hex')))" "YOUR-NEW-PASSWORD"
```

The optional server-side CSV endpoint also uses ChatGPT Sites identity. Set `AURA_ADMIN_EMAIL` to the owner email if that endpoint is required. The dashboard's normal **Export CSV** button works in the browser and does not require that email setting.

## ChatGPT Sites deployment

The included `.openai/hosting.json`, Vinext configuration and Cloudflare D1 code are the production architecture used by the current site. For a new customer-owned Sites project, create a new project/database instead of reusing the included project ID, then configure the two admin environment values above.

## Vercel or Hostinger

The interface is built with React and the Next.js App Router, but the included backend uses Cloudflare D1 and `cloudflare:workers`. It is therefore not a drop-in Vercel or Hostinger backend.

Before deploying independently to Vercel or Hostinger:

1. Replace `db/index.ts` with a database adapter for Postgres or MySQL.
2. Keep the same `enquiries` columns defined in `db/schema.ts` and `drizzle/0000_orange_crystal.sql`.
3. Replace the ChatGPT-specific auth helper if you want the optional server CSV route.
4. Configure a secure dashboard password hash as an environment variable.
5. Test form submission, dashboard login and CSV export on the new host.

For Hostinger, select a plan that supports Node.js applications and use its MySQL database. A basic shared/static-only plan will not run these API routes or the dashboard backend. On any host, the dashboard opens normally once the database and environment values are configured; it is part of this same website at `/dashboard`.

## Images and rights

The image files used by the site are in `public/images`. Review `public/image-credits.txt`. Confirm that the business owns, licensed or has permission to publish every final image before transferring the site to a customer.
