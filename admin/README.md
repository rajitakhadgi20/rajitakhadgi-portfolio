# Rajita Portfolio — Admin Dashboard

The admin dashboard for managing your portfolio's projects and contact
messages. A React + Vite app that talks to the `backend` API.

## Setup

```bash
cp .env.example .env   # defaults to http://localhost:4000
npm install
npm run dev             # http://localhost:5174
```

Make sure the backend is running first (`cd ../backend && npm run dev`) and
that you've run `npm run seed` there at least once to create your admin
account.

## Using it

Sign in with the email/password you set in `backend/.env`
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`). You can also get here by clicking
**Login** on the portfolio site itself — that signs you in against the same
backend and redirects you here automatically with your session.

- **Projects** — add, edit, delete, and reorder (↑ / ↓) the projects shown
  on the live site. Changes appear on the portfolio as soon as you save.
- **Messages** — everything submitted through the site's contact form,
  read/unread state, and a one-click "Reply by Email".

## Build

```bash
npm run build   # outputs to dist/, deploy anywhere static
```

Set `VITE_API_URL` in your hosting provider's environment settings to point
at your deployed backend before building for production.
