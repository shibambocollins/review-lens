# CLAUDE.md

Context for Claude Code (or any agentic tool) working in this repo. Read this before making
changes — several of the "obvious" fixes below were already tried and reverted for a reason.

## What this is

ReviewLens — AI-powered review intelligence platform. Search any business, get an AI-generated
dashboard: sentiment analysis, emotion detection, aspect-based breakdowns (food/service/cleanliness
/pricing/wait time), trend charts, AI summary, insights/recommendations, and a competitor
comparison view. No auth, no database — fully stateless, every analysis is generated fresh.

**Live:** https://www.ratingslensai.tech (frontend, Vercel) · https://review-lens-t395.onrender.com
(backend, Render)

## Non-negotiable architecture rule

**No AI provider key may ever reach the frontend or the browser.** All Gemini/Groq/Cloudflare
calls happen in `backend/`. The frontend (`frontend/src/services/api.js`) only ever calls this
project's own backend (`/api/search`, `/api/analyze`, `/api/compare`). If a task seems to require
calling an AI provider from frontend code, that's a sign the task should add a new backend route
instead — don't work around this.

## Repo layout

```
backend/    Express API — the only place AI provider keys exist
  server.js               CORS setup (multi-origin, see below), route mounting
  src/config/index.js      loads env vars, parses FRONTEND_URL into an array
  src/services/
    aiProviders/{gemini,groq,cloudflare}.js   one call function per provider
    aiFallback.js           generateAnalysis({ prompt, geminiSchema, schemaInstructions, order })
    prompts.js               prompt text + schema (Gemini-native + plain-text) per task
    extractJson.js           strips code fences, parses model text as JSON
  src/routes/{search,analyze,compare,reviews}.js
frontend/   Vite + React
  src/services/api.js       the ONLY file that calls fetch() against our backend
  src/components/           Card, Badge, Toast, HomeView, DashboardView, CompareView
  src/data/{mockBusinesses,colors}.js
```

## Commands

```bash
# Backend
cd backend && npm install && npm run dev     # localhost:5000
curl http://localhost:5000/api/health         # confirm which providers have keys set

# Frontend
cd frontend && npm install && npm run dev     # localhost:5173
npm run build                                  # verify it compiles before pushing
```

There is no test suite yet. Verifying a change means: run both dev servers locally, hit the
relevant endpoint with curl or the UI, and check the backend terminal for
`[ReviewLens] <provider> failed: ...` warnings.

## The AI fallback chain — how it's supposed to work

`generateAnalysis()` in `aiFallback.js` takes an `order` array and tries each provider in that
order, falling through on failure, logging a `console.warn` each time. **The order is intentionally
different per route** — don't "simplify" this to one fixed order:

- `routes/search.js` → `['groq', 'gemini', 'cloudflare']`. This fires on every keystroke
  (debounced 600ms in `App.jsx`). Groq is first because it's dramatically faster than Gemini for
  short structured output, and speed matters for a type-ahead UI.
- `routes/analyze.js` / `routes/compare.js` → `['gemini', 'groq', 'cloudflare']`. This fires once
  per business. Gemini is first because output quality/depth matters more than speed for a
  one-shot full report.

Gemini gets a native `responseSchema` (Google's structured output). Groq and Cloudflare don't
support that — they get the schema described in plain English inside the prompt string instead,
plus Groq uses `response_format: json_object` to force valid JSON syntax.

## Location-biased search

There's no real geocoding/places API in this app — "near me" results are still fully
AI-generated, just steered by coordinates:

- `App.jsx` requests `navigator.geolocation` once on mount and again via a retry button (the
  "Search near me" / "Location blocked — click to retry" pill under the home search box). Denial
  or an unsupported browser just falls back to the old behavior — `location` stays `null` and
  nothing about the request changes.
- `liveSearch(query, coords)` in `api.js` only adds `lat`/`lng` to the POST body when `coords` is
  non-null — `routes/search.js` treats missing/non-finite `lat`/`lng` as "no location" rather than
  erroring.
- `liveSearchPrompt(query, coords, relatedTo)` in `prompts.js` appends location context to the
  prompt when coords are present, asking the model for realistic nearby neighborhoods and a
  `distanceKm` estimate per result. `distanceKm` is optional in both schemas (not in `required`)
  since it's only meaningful when coords were supplied — don't make it required or plain text
  search without location will fail schema validation.
- `relatedTo` (`{ name, category }`) is the same `liveSearch()`/`liveSearchPrompt()` path reused by
  `CompareView` — it softly biases results toward competitors of the business being compared
  ("where consistent with the search query"), it never overrides the literal typed query. This is
  why searching "burger" while comparing a coffee shop still returns burger places, but a vague
  query like "highly rated place" leans toward coffee shops. `CompareView` gets `location` passed
  down as a prop from `App.jsx` rather than requesting geolocation itself — there's only one
  geolocation prompt for the whole app, fired once from `App.jsx` on mount.
- Picking a result from `CompareView`'s live-search dropdown calls `analyzeBusiness()` (the same
  `/api/analyze` full-analysis endpoint the primary business uses), not `/api/compare` — this gives
  more accurate results since the business's real fields (address, rating, category from the search
  step) seed the analysis instead of asking the model to invent a business from a bare name.
  `/api/compare` (`compareBusiness()`) is kept only as the fallback for pressing Enter without
  picking a suggestion.

## Load More Reviews

`POST /api/reviews/more` (`routes/reviews.js` → `moreReviewsPrompt` in `prompts.js`) generates 4
more AI reviews for a business, distinct from ones already shown — it passes the existing reviews'
text back into the prompt as an exclusion list so the model doesn't repeat itself. `DashboardView`
owns the review list as local state (`reviews`, seeded from `business.reviews`, reset on
`business.id` change) rather than mutating the parent's `analyzedBusinesses` — reviews loaded this
way aren't persisted if you navigate away and back, which is fine since nothing here is persisted
anyway. Client-side id collisions (the model reusing `r1`, `r2`, ...) are rewritten to a unique id
before appending. Capped at `MAX_REVIEWS` (24) or whenever a fetch returns zero new reviews,
whichever comes first — the button hides itself past that point instead of retrying forever.

## Two bugs already fixed here — don't reintroduce them

1. **Groq requires a top-level JSON *object*, not a bare array.** `response_format: json_object`
   silently fails/empties out if you ask for a bare array. This is why `liveSearchPrompt`'s
   `schemaInstructions` wraps results as `{ "results": [...] }`, and `routes/search.js` checks
   `Array.isArray(data) ? data : data?.results` — Gemini's native schema still returns a bare
   array, Groq/Cloudflare return the wrapped object. If you touch this prompt or route, keep both
   shapes handled.

2. **CORS must accept multiple origins, not one hardcoded string.** `config/index.js` parses
   `FRONTEND_URL` as a comma-separated list (`frontendUrls`), and `server.js`'s `cors({ origin })`
   checks membership in that list rather than exact string equality against a single value. This
   exists because the app is actively deployed across multiple frontend URLs (Vercel default
   domain, `www.ratingslensai.tech`, bare `ratingslensai.tech`) — reverting to a single origin
   string will break whichever URL isn't currently set.

## Deployment specifics

- Render (backend): env vars set in Render's dashboard, not read from a committed `.env`. `PORT`
  is supplied by Render automatically.
- Vercel (frontend): root directory is `frontend/` (repo has both `backend/` and `frontend/` at
  root — Vercel needs to be told which to build). `VITE_API_URL` points at the Render backend URL
  + `/api`.
- `FRONTEND_URL` on Render must include every origin currently in use, comma-separated, full
  `https://`, no trailing slashes — e.g.
  `https://www.ratingslensai.tech,https://ratingslensai.tech,https://review-lens-five.vercel.app`.
  Adding a new frontend URL (new domain, new Vercel preview) means updating this list.
- Render's free tier spins down when idle — first request after inactivity takes 10–30s. Expected,
  not a bug.

## Known placeholders / intentionally not built yet

- Business images are `picsum.photos` random seeded placeholders, not real photos. Don't "fix"
  this by adding a real image API without being asked — it's a known, accepted gap for now.
- No rate limiting on backend routes. No database. No auth. These are deliberate, not oversights —
  don't add them speculatively.

## Conventions

- Backend is ES modules (`"type": "module"` in package.json) — use `import`/`export`, not
  `require`.
- Every new AI-calling route should go through `aiFallback.js`'s `generateAnalysis()`, not call a
  provider directly.
- Keep `frontend/src/services/api.js` as the single chokepoint for network calls from the
  frontend — components should import from there, not call `fetch` themselves.
- Color palette lives in `frontend/src/data/colors.js` (`COLORS.positive/neutral/negative/primary/
  secondary`) — reuse it rather than hardcoding hex values in new components.
