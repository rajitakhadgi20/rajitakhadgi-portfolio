# Rajita Portfolio — Site

The public portfolio site (React + Vite). Organized into small components
under `src/components/`, with theme tokens, project data, and shared hooks
split out under `src/data/`, `src/hooks/`, and `src/styles/`.

## Setup

```bash
cp .env.example .env   # defaults point at localhost:4000 / :5174
npm install
npm run dev             # http://localhost:5173
```

## How content works

Project cards are fetched live from the backend (`GET /api/projects`) via
the `useProjects` hook in `src/hooks/useProjects.js`. If the backend can't
be reached, the site falls back to the static list in `src/data/projects.js`
so it still renders on its own — handy for a quick preview without spinning
up the API.

Edit projects from the **admin dashboard** (`../admin`), not by hand in
`data/projects.js` — that file is only the offline fallback.

## Admin login

The site's own "Login" link (in the mobile menu) signs in against the
backend and redirects to the admin dashboard. See `../admin/README.md`.

## Build

```bash
npm run build   # outputs to dist/
```

Set `VITE_API_URL` and `VITE_ADMIN_URL` in your host's environment settings
to your deployed backend/admin URLs before building for production.
