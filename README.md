# APC Web

Web application for the **Alabama Productivity Center (APC)** — public marketing site plus a role-based dashboard for staff, interns, applicants, and related workflows.

Production deploys from Azure Pipelines to Azure App Service (`apc-ua-next`). Data lives in Azure SQL; file uploads (resumes, presentations, headshots, Manage handouts, etc.) live in Azure Blob Storage (`apcstorage`).

## What’s in this repo

### Public site
Marketing and outreach pages under `src/app/Home/` and related routes, including:

- Home, About, Contact, Locations  
- Internships, Services / Expanded Services  
- Success stories, newsletters, intern spotlights  
- Staff profiles, Apply form  

### Dashboard (authenticated)
Role-gated app for day-to-day APC operations, including:

- **Interns** — details, timelogs, schedules, reports, returning semester, archive  
- **Applicants** — search, details, promote to intern  
- **Manage** — account tools, Edit Info (interns), To-Do List, impact totals, staff resource links, users/roles  
- **Presentations**, **Companies**, **Services**, **Past Interns**  
- **Client Timelogs** — payday emailing via Outlook OAuth  
- **Time** — intern weekly time logging  

Auth uses iron-session with ASP.NET Identity–compatible password hashing against the existing user/role tables.

### Backend & data
- **Next.js App Router** API routes under `src/app/api/`  
- **Prisma** + SQL Server (`prisma/schema.prisma`, migrations in `prisma/migrations/`)  
- **Azure Blob** helpers in `src/lib/azure-storage.ts` — downloads go through authenticated `/api/files/...` (and `/api/public-files/...` for selected public PDFs) so containers can stay private  

Notable recent patterns:

- Intern **headshots** stored in blob container `intern-headshots` (opaque UUID + `Interns.HeadshotId`); staff update from Intern Details; interns can upload from Manage → Edit Info  
- Resumes / impact calculators / presentations follow the same “upload → blob UUID → DB id” pattern  

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| UI | Tailwind CSS, HeroUI |
| DB | Azure SQL via Prisma |
| Files | Azure Blob Storage |
| Auth | iron-session + AspNetUsers / roles |
| CI/CD | Azure Pipelines → App Service |

## Project layout (high level)

```
src/app/           # Pages + API routes
src/components/    # Shared UI
src/lib/           # Auth, Prisma, Azure, API clients, validation
prisma/            # Schema + SQL migrations
public/            # Static assets (images, etc.)
docs/              # Ops notes (e.g. private blob flip)
scripts/           # One-off maintenance scripts (migrate headshots, etc.)
azure-pipelines.yml
```

## Local development

### Prerequisites
- Node.js 22.x (matches pipeline)
- Access to Azure SQL (typically **TestDB** for local work) and blob storage connection string

### Setup

1. Clone the repo and install dependencies:

```bash
npm ci
```

2. Create a `.env` in the repo root (**never commit this file**). See [Environment variables](#environment-variables) below.

Use **TestDB** for everyday local work. Point at LiveDB only for deliberate data tasks, then switch back.

3. Generate Prisma client and run the app:

```bash
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Useful scripts

```bash
npm run dev      # Next.js dev server
npm run build    # prisma generate + production build
npm run lint     # ESLint
npx prisma migrate deploy   # apply migrations to DATABASE_URL
```

## Environment variables

Values below are **names and purposes only**. Copy real values from a teammate, Azure Portal, or your local `.env` — do not paste secrets into git or chat logs.

### Required for core app (login, dashboard, uploads)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Azure SQL connection string (Prisma). Local: usually `TestDB`. Production pipeline / App Service: LiveDB. |
| `SESSION_SECRET` | Encrypts iron-session cookies (use a long random string; min ~32 chars). |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob account connection string (`apcstorage`). Resumes, presentations, headshots, Manage files, etc. |

### Email / Outlook (feature-specific)

| Variable | Purpose |
|----------|---------|
| `INTERN_CONTACT_TO_EMAIL` | Inbox for Manage → Intern Help Request. |
| `MS_GRAPH_CLIENT_ID` | Microsoft app registration client ID (Outlook send). |
| `MS_GRAPH_CLIENT_SECRET` | Microsoft app client secret. |
| `OUTLOOK_OAUTH_TENANT` | OAuth tenant (e.g. `consumers`). |
| `OUTLOOK_SENDER_EMAIL` | From-address when sending via Graph (e.g. `apc-ua@outlook.com`). |
| `OUTLOOK_OAUTH_REDIRECT_URI` | OAuth callback URL (local example: `http://localhost:3000/api/manage/outlook-oauth/callback`; production must match App Service URL). |
| `OUTLOOK_REFRESH_TOKEN` | Optional; refresh token can also be stored after Manage → Outlook Mail connect. |
| `RESEND_API_KEY` | Fallback email provider when Outlook is not connected. |
| `RESEND_FROM` | From-address for Resend. |

### Cron / hosting

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Shared secret for authenticated cron routes (e.g. client timelogs Monday job). |
| `WEBSITE_HOSTNAME` | Set automatically on Azure App Service; used to build public URLs when present. |
| `NEXT_PUBLIC_APP_URL` | Optional explicit public site URL (OAuth redirects / absolute links). |
| `NODE_ENV` | Set by Next/Node (`development` / `production`); not usually put in `.env`. |

## Database & environments

- Schema changes go in `prisma/migrations/` and are applied in CI with `prisma migrate deploy` using the pipeline `DATABASE_URL` (production / LiveDB).  
- Prefer developing against TestDB; LiveDB for production-only data work.  
- Blob storage is often shared between environments — use UUID blob names and avoid bulk-deleting containers while testing.

## Deploy

Pushing to `main` triggers `azure-pipelines.yml`: install → Prisma generate → migrate deploy → Next.js standalone build → zip → deploy to App Service.

Confirm App Service has the same env vars as local for anything you rely on in production (`DATABASE_URL`, `SESSION_SECRET`, `AZURE_STORAGE_CONNECTION_STRING`, plus Outlook/Resend/cron vars if those features are used).

## Notes for contributors

- Role checks live on both UI and API routes — don’t rely on the UI alone.  
- Prefer opaque blob names for person-related files (no phone numbers or CWIDs in public URLs).  
- Large one-off maintenance scripts belong under `scripts/` and should refuse TestDB when the job is Live-only (or the reverse).  
- Keep secrets out of git; rotate anything that was ever committed accidentally.

## License / ownership

Private APC project — not an open-source template. Contact APC IT / repo maintainers for access and production changes.
