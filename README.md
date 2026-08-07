# ReviewLens — AI Review Intelligence Platform
 
**Live site:** https://www.ratingslensai.tech
**Backend API:** https://review-lens-t395.onrender.com/api
 
AI-powered platform that turns customer reviews for restaurants, hotels, cafés, and other
businesses into an interactive intelligence dashboard: sentiment analysis, emotion detection,
aspect-based breakdowns (food, service, cleanliness, pricing, wait time), trend charts, AI-written
summaries, and a competitor comparison view. No login required — search a business, get a report.
 
Originally generated as a single-file Gemini Canvas export, then restructured into a proper
full-stack app (same pattern as the MyCapePlanner and AI Content Studio builds): a small Express
backend holds every AI provider key and does the actual model calls; the React frontend only ever
talks to that backend, never to Gemini/Groq/Cloudflare directly.
 
---
 
 
## Why a backend exists
 
The original Canvas export called `generativelanguage.googleapis.com` directly from the browser
with the API key in the URL (`?key=...`). Any key pasted into a purely client-side app like that
is visible to anyone who opens DevTools — so the very first thing this rebuild fixes is moving
every AI call server-side. The frontend calls `/api/search`, `/api/analyze`, `/api/compare` on
**your own backend**; the backend is the only thing that ever holds a Gemini/Groq/Cloudflare key.
 
This also gives us one place to implement a fallback chain — if one AI provider is down, rate
limited, or slow, the backend automatically retries on the next one, invisibly to the user.
 
## Architecture
 
```
Browser  →  Vercel (frontend, static Vite build)  →  Render (backend, Express)  →  Gemini / Groq / Cloudflare Workers AI
```
 
- **No database.** Nothing is persisted. Every "Analyze" click re-generates the analysis fresh.
- **No auth.** Anyone can search and analyze; there's nothing user-specific to protect.
- **Stateless backend.** Each request is independent; the backend holds no session state, only
  provider keys read once at boot from environment variables.
## Project structure
 
```
review-lens/
  backend/                     Express API — holds all AI provider keys
    server.js                  App entry point, CORS config, route mounting
    .env.example
    src/
      config/
        index.js               Loads & normalizes env vars (incl. multi-origin FRONTEND_URL)
      services/
        aiProviders/
          gemini.js             Gemini call using native responseSchema (strict structured output)
          groq.js                Groq call (OpenAI-compatible chat completions, json_object mode)
          cloudflare.js          Cloudflare Workers AI call
        aiFallback.js           Runs providers in a configurable order, returns first success
        prompts.js               Prompt text + JSON schema definitions for every AI task
        extractJson.js           Strips code fences / stray text, safely parses model output as JSON
      routes/
        search.js                POST /api/search   — live search dropdown (order: Groq → Gemini → Cloudflare)
        analyze.js                POST /api/analyze   — full deep analysis (order: Gemini → Groq → Cloudflare)
        compare.js                POST /api/compare   — competitor analysis for the Compare view
      middleware/
        errorHandler.js
  frontend/                     Vite + React app
    .env.example
    src/
      main.jsx
      App.jsx                   Top-level state, routing between Home/Dashboard/Compare views
      index.css
      data/
        mockBusinesses.js       6 demo South African businesses shown on first load
        colors.js               Shared color palette used across charts/UI
      services/
        api.js                  The ONLY file that talks to the network — everything else calls into it
      components/
        Card.jsx, Badge.jsx, Toast.jsx
        HomeView.jsx             Hero search + live dropdown + results grid
        DashboardView.jsx        Sentiment/emotion/trend charts, aspects, reviews, PDF export
        CompareView.jsx          Side-by-side comparison + competitor search
  .gitignore
  README.md
```
 
## Running it locally
 
### Backend
 
```bash
cd backend
cp .env.example .env
# paste real keys into .env — see "Environment variables" below
npm install
npm run dev
```
 
Runs on `http://localhost:5000`. Confirm it's up and see which providers are configured:
 
```bash
curl http://localhost:5000/api/health
# {"status":"ok","providers":{"gemini":true,"groq":true,"cloudflare":true}}
```
 
### Frontend
 
```bash
cd frontend
cp .env.example .env      # VITE_API_URL defaults to http://localhost:5000/api — fine for local dev
npm install
npm run dev
```
 
Runs on `http://localhost:5173`.
 
## Environment variables
 
All of these live in **`backend/.env`** locally, or in Render's Environment tab in production.
The frontend never holds a provider key — its only env var is `VITE_API_URL`.
 
| Variable | Required? | Description |
|---|---|---|
| `PORT` | No (Render sets it) | Port the Express server listens on. Defaults to 5000 locally. |
| `FRONTEND_URL` | Yes | Comma-separated list of allowed origins for CORS. See CORS section below. |
| `GEMINI_API_KEY` | Recommended | [Google AI Studio](https://aistudio.google.com/apikey) key. Primary provider for deep analysis. |
| `GEMINI_MODEL` | No | Defaults to `gemini-2.0-flash`. Currently set to `gemini-3-flash-preview`. |
| `GROQ_API_KEY` | Recommended | [console.groq.com/keys](https://console.groq.com/keys). Primary provider for live search (fast). |
| `GROQ_MODEL` | No | Defaults to `llama-3.3-70b-versatile`. |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` | Optional | Cloudflare dashboard → Workers AI. Last-resort fallback. |
| `CLOUDFLARE_MODEL` | No | Defaults to `@cf/meta/llama-3.1-8b-instruct-fast`. |
 
You don't need all three providers configured — if a key is missing, that provider's function
throws immediately and the chain just moves to the next one. Gemini + Groq alone covers both use
cases (quality + speed); Cloudflare is a bonus safety net.
 
**`frontend/.env`:**
 
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, including `/api`. e.g. `https://review-lens-t395.onrender.com/api` |
 
## The AI provider fallback chain
 
`aiFallback.js` exposes `generateAnalysis({ prompt, geminiSchema, schemaInstructions, order })`.
Each route passes its own `order` array, because speed and quality matter differently depending
on the call:
 
- **`/api/search`** — fires on every keystroke (debounced 600ms). Order: **Groq → Gemini →
  Cloudflare**. Groq runs on dedicated inference hardware (LPUs) and responds far faster than
  Gemini for short structured output — this matters a lot for a type-ahead UI. Gemini alone was
  noticeably slow here in testing.
- **`/api/analyze`** and **`/api/compare`** — fire once per business, generating a full report.
  Order: **Gemini → Groq → Cloudflare**. Quality and depth matter more than speed for a one-shot
  deep analysis, so Gemini goes first.
Within any order, if a provider throws (bad key, rate limit, safety filter block, network error),
the backend logs `console.warn('[ReviewLens] <provider> failed: ...')` and falls through
automatically. If every provider in the order fails, the route returns a 500 with all the
collected error messages, which the frontend shows as a toast.
 
Gemini uses its native `responseSchema` (Google's structured-output feature — strict, reliable).
Groq and Cloudflare don't support that, so for them the required JSON shape is spelled out in
plain text inside the prompt, plus Groq's `response_format: json_object` forces syntactically
valid JSON back.
 
## Known issues we hit and fixed
 
**1. Groq returning empty search results (`{"results":[],"provider":"groq"}`)**
Cause: Groq's `response_format: json_object` mode requires the top-level JSON to be an *object*,
not a bare array — but the search prompt originally asked for a bare array of businesses. Fixed by
wrapping the array as `{ "results": [...] }` in the schema instructions, and having
`routes/search.js` accept either a bare array (Gemini's native path) or `data.results` (Groq/
Cloudflare's wrapped path).
 
**2. CORS blocking every request from the live site**
`server.js` only allows requests whose `Origin` header exactly matches `FRONTEND_URL`. Since the
app was tested across several URLs during setup (Vercel default domain, custom domain, `www` vs
bare domain), a single hardcoded origin kept breaking every time the frontend URL changed. Fixed
by making `FRONTEND_URL` accept a **comma-separated list** and checking membership instead of
exact equality — see `config/index.js` (`frontendUrls` array) and the custom CORS `origin`
function in `server.js`.
 
**3. PDF export was just `window.print()`**
Replaced with a real generated PDF: `html2canvas` screenshots each dashboard tab (Overview,
Aspects, Reviews) in turn, and `jsPDF` stitches them into a multi-page downloadable PDF. The
business image needs `crossOrigin="anonymous"` set or html2canvas throws a "tainted canvas" error
trying to read pixel data from a cross-origin image.
 
## Deployment (current live setup)
 
- **Backend → Render.** Env vars are set directly in Render's dashboard (Environment tab) — Render
  does not read a `.env` file from the repo. `PORT` is supplied automatically by Render; don't set
  it yourself.
- **Frontend → Vercel.** Root directory set to `frontend/` (the repo has both `backend/` and
  `frontend/`, so Vercel needs to be told which one to build). Framework preset auto-detects as
  Vite. `VITE_API_URL` set in Vercel's project Environment Variables to the Render backend URL +
  `/api`.
- **Custom domain → `ratingslensai.tech`**, bought through a `.tech` registrar, DNS pointed at
  Vercel:
  - `A` record, name `@`, value Vercel's IP (shown in Vercel's Domains tab)
  - `CNAME` record, name `www`, value Vercel's assigned hostname
  - The bare domain 308-redirects to `www.ratingslensai.tech`, which is the real production URL.
- **CORS**: `FRONTEND_URL` on Render is set to a comma-separated list covering every origin
  actually in use, e.g.:
```
  https://www.ratingslensai.tech,https://ratingslensai.tech,https://review-lens-five.vercel.app
```
  Full `https://`, no trailing slashes, no spaces around commas. Whenever a new frontend URL comes
  into play (new custom domain, new Vercel preview), it needs to be added to this list or the live
  site's API calls get silently blocked by the browser.
- **Free tier note**: Render's free tier spins down after inactivity. The first request after a
  quiet period takes 10–30 seconds while it wakes back up — not a bug, just the free tier.
## Troubleshooting
 
**"CORS error" in the browser console / network tab shows the request failing**
→ `FRONTEND_URL` on Render doesn't include the exact origin you're browsing from. Check the
address bar's protocol + domain (no path, no trailing slash) and make sure that exact string is in
the comma-separated list on Render. Redeploy, then hard-refresh (Ctrl+Shift+R) to bypass any cached
CORS failure.
 
**Search returns "No matching businesses found" / empty results**
→ Check `provider` in the raw JSON response (Network tab → the `/api/search` request → Response).
If it's not `"groq"` on a healthy request, something upstream failed silently — check Render's logs
for `[ReviewLens] <provider> failed: ...` warnings to see why a provider was skipped.
 
**Live search is slow**
→ Confirm `routes/search.js` still has `order: ['groq', 'gemini', 'cloudflare']`. If it's fallen
back to Gemini (check the `provider` field in the response), Groq's key may be missing/invalid on
Render — check `/api/health` for `"groq": true`.
 
**PDF export fails or produces a blank image**
→ Usually a cross-origin image issue. Confirm the business `<img>` tag has
`crossOrigin="anonymous"` set, and that the image host (`picsum.photos` by default) sends
CORS-friendly headers — most public image CDNs do.
 
**Backend `/api/health` returns `providers: { gemini: false, ... }`**
→ That key is missing or empty in Render's Environment tab. Note Render only re-reads env vars on
redeploy — if you just added a key, wait for the auto-redeploy to finish before retesting.
 
## Roadmap / not built yet
 
- **Location-based search** — not implemented. Would use `navigator.geolocation` in the frontend
  to grab the user's coordinates, pass `lat`/`lng` through `api.js` → `/api/search`, and have the
  search prompt bias results toward nearby businesses.
- **Real business photos** — currently `picsum.photos` random seeded placeholders, not actual
  photos of the business. Could be replaced with the Google Places Photos API.
- **Rate limiting** — the backend has no request throttling yet. Now that it's live behind a public
  URL, a burst of traffic (or abuse) on `/api/analyze` could burn through Gemini/Groq quota fast.
- **Bare-domain A record** — `ratingslensai.tech` (no `www`) may still need its A record added at
  the registrar for the 308 redirect to resolve cleanly; `www.ratingslensai.tech` is the confirmed
  working production URL regardless.
## Tech stack
 
**Backend:** Node.js, Express, native `fetch` (no HTTP client library), `dotenv`, `cors`
**Frontend:** React 18, Vite, Tailwind CSS, Recharts (charts), Lucide React (icons), jsPDF +
html2canvas (PDF export)
**AI providers:** Google Gemini (primary for analysis), Groq (primary for search, OpenAI-compatible
API), Cloudflare Workers AI (fallback)
**Hosting:** Render (backend), Vercel (frontend), custom `.tech` domain
