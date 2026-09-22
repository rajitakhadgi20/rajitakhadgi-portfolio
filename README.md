# Rajita Portfolio

Three pieces, run separately (three terminal tabs, or three deploys):

```
frontend/   Your portfolio site (React + Vite). Public.
backend/    The API (Express + SQLite). Powers projects data + contact form.
admin/      The admin dashboard (React + Vite). Where you manage everything.
```

Previously this was one giant 1,666-line file with no backend and a Netlify CMS
admin that needed a Netlify Identity account to use. It's now split into
readable components, has its own database and API, and has a proper admin
dashboard you log into directly from the site.

## 1. Backend — set up first

```bash
cd backend
cp .env.example .env
```

Open `.env` and set at minimum:
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your admin login
- `SMTP_*` / `CONTACT_TO_EMAIL` — optional, only needed if you want contact-form
  submissions emailed to you (they're saved to the database either way, so you
  can always read them in the admin dashboard even without this)

Then:

```bash
npm install
npm run seed    # creates your admin account + imports your 10 existing projects
npm run dev     # starts the API on http://localhost:4000
```

## 2. Frontend

```bash
cd frontend
cp .env.example .env   # defaults already point at localhost:4000 / :5174
npm install
npm run dev             # http://localhost:5173
```

The site loads projects live from the backend. If the backend isn't running,
it falls back to a static copy of the same 10 projects so the site still
works standalone (e.g. for a quick preview).

## 3. Admin dashboard

```bash
cd admin
cp .env.example .env
npm install
npm run dev             # http://localhost:5174
```

Log in either directly at `http://localhost:5174`, or from the portfolio
site itself — open the mobile menu and tap **Login**, which signs you in
against the backend and drops you straight into the dashboard. From there you
can add, edit, delete, and reorder projects, and read/delete messages
submitted through the contact form.

## Deploying

- **Backend**: any Node host (Railway, Render, Fly.io, a VPS). It uses a
  local SQLite file (`data.sqlite3`), so make sure the host has persistent
  disk — don't use a container that wipes its filesystem on redeploy.
- **Frontend**: Netlify/Vercel/any static host, same as before. Set
  `VITE_API_URL` and `VITE_ADMIN_URL` to your deployed backend and admin
  URLs in the host's environment settings before building.
- **Admin**: same static hosting as the frontend, on its own subdomain (e.g.
  `admin.yoursite.com`), with `VITE_API_URL` set to your backend.

Each app has its own `.env.example` — copy it to `.env` and fill in the real
values wherever you deploy.
