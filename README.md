# ReviewLens - AI Review Intelligence Platform

Restructured from a single-file Gemini Canvas export into a proper full-stack app, following the
same pattern as MyCapePlanner: a small Express backend holds the AI provider keys and does the
actual model calls; the React frontend only ever talks to your own backend.

No auth, no database — fully stateless. Every "Analyze" click calls the AI fresh. PDF export uses
the browser print dialog and sharing uses the Web Share API / clipboard, both entirely client-side.

## Why a backend at all?

The original Canvas file called `generativelanguage.googleapis.com` directly from the browser with
`?key=` in the URL. Any API key you paste into a client-side app like that is visible to anyone who
opens devtools. The backend fixes that, and also gives you a place to do the Gemini → Groq →
Cloudflare Workers AI fallback chain, since Groq/Cloudflare have no browser-safe way to call them either.

## Structure

```
review-lens/
  backend/            Express API (holds all AI keys)
    server.js
    src/
      config/         env var loading
      services/
        aiProviders/  gemini.js, groq.js, cloudflare.js (one file per provider)
        aiFallback.js Tries Gemini -> Groq -> Cloudflare Workers AI in order
        prompts.js     prompt + schema definitions for search/analyze/compare
        extractJson.js safely parses JSON out of a model's raw text response
      routes/          search.js, analyze.js, compare.js
      middleware/
    .env.example
  frontend/           Vite + React app
    src/
      components/      Card, Badge, Toast, HomeView, DashboardView, CompareView
      data/            mockBusinesses.js (6 demo SA businesses), colors.js
      services/api.js  the ONLY place the frontend calls the network
      App.jsx
    .env.example
```

## Running it locally

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env and paste in real keys - see "API keys" below
npm install
npm run dev
```

Backend runs on `http://localhost:5000`. Check it's alive and see which providers are configured:

```bash
curl http://localhost:5000/api/health
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api, fine for local dev
 run dev
npm run dev 
```

Frontend runs on `http://localhost:5173`.

## API keys — where to put yours

Edit `backend/.env` (never `frontend/.env` — the frontend should never hold a provider key):

| Variable | Where to get it |
|---|---|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `GROQ_API_KEY` | [console.groq.com/keys](https://console.groq.com/keys) |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → Workers AI |

You don't need all three to run the app — Gemini alone is enough. Groq and Cloudflare are there so
that if Gemini is rate-limited or down, the request automatically retries on the next provider in
the chain (`backend/src/services/aiFallback.js`). If you only set up Gemini, that's fine; the other
two will just be skipped (their `generateWith...` functions throw immediately if their key is missing,
and the chain moves on).

## How the fallback chain works

`POST /api/analyze` (and `/api/search`, `/api/compare`) call `generateAnalysis()` in
`aiFallback.js`, which:

1. Tries Gemini first, using Gemini's native `responseSchema` (strict structured output).
2. If that throws (bad key, rate limit, safety block, network error), tries Groq — same prompt,
   but the JSON shape is described in plain text in the prompt instead of a native schema, and
   `response_format: json_object` forces valid JSON back.
3. If that also fails, tries Cloudflare Workers AI the same way.
4. If all three fail, the route returns a 500 with the combined error messages from each attempt,
   which the frontend surfaces as a toast.

## What's next / things you might want to add later

- **Real PDF export**: right now "Export Report" uses `window.print()`. If you want an actual
  downloadable PDF with embedded charts (like MyCapePlanner's jsPDF export), that's a frontend-only
  change — capture the dashboard DOM with `html2canvas` and feed it to `jsPDF`.
- **Rate limiting** on the backend routes before you put a real key behind a public URL — someone
  spamming `/api/analyze` will burn through your Gemini/Groq quota fast.
- **Deployment**: this was built to run locally first. When you're ready, Render (backend) +
  Vercel (frontend) mirrors your AI Content Studio setup; Azure App Service + Vercel mirrors
  MyCapePlanner. Either works — just set `FRONTEND_URL` in the backend env and `VITE_API_URL` in
  the frontend env to the deployed URLs.
