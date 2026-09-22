# Rajita Portfolio — Backend

Express + SQLite API powering the portfolio's project data, the admin
dashboard, and the contact form.

## Setup

```bash
cp .env.example .env
```

Edit `.env`:
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your admin login (used by `npm run seed`)
- `SMTP_*` / `CONTACT_TO_EMAIL` — optional. Contact messages are always saved
  to the database; these just also email them to you. Works with Gmail (use
  an [App Password](https://myaccount.google.com/apppasswords)) or any SMTP
  provider.

```bash
npm install
npm run seed    # creates the admin account + imports the starter projects
npm run dev     # http://localhost:4000, auto-restarts on changes
```

## API

| Method | Path                     | Auth | Description |
|--------|--------------------------|------|-------------|
| POST   | `/api/auth/login`        | —    | `{ email, password }` → `{ token, admin }` |
| GET    | `/api/auth/me`           | ✓    | Current admin from the token |
| GET    | `/api/projects`          | —    | List projects (public, what the site shows) |
| GET    | `/api/projects/:id`      | —    | One project |
| POST   | `/api/projects`          | ✓    | Create |
| PUT    | `/api/projects/:id`      | ✓    | Update |
| DELETE | `/api/projects/:id`      | ✓    | Delete |
| PUT    | `/api/projects/reorder/all` | ✓ | `{ order: [id, id, ...] }` — sets display order |
| POST   | `/api/contact`           | —    | Submit the contact form |
| GET    | `/api/contact`           | ✓    | List messages, newest first |
| PUT    | `/api/contact/:id/read`  | ✓    | `{ read: true/false }` |
| DELETE | `/api/contact/:id`       | ✓    | Delete a message |

Routes marked ✓ need `Authorization: Bearer <token>` from `/api/auth/login`.

## Data

SQLite file at `data.sqlite3` (git-ignored). Re-running `npm run seed` is
safe — it updates the admin account if it already exists, and only seeds
projects if the table is empty.

## Deploying

Any Node host with persistent disk (Railway, Render, Fly.io, a VPS) — SQLite
needs the filesystem to survive redeploys. Set `CORS_ORIGIN` to your deployed
frontend and admin URLs (comma-separated), and run `npm run seed` once
against the production database.
