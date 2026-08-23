# FluentFeed — Practice Partners

A full-stack app that helps English learners find compatible practice
partners, see a transparent compatibility score, connect, and get a
random discussion topic to practice with once connected.

---

## Table of contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Database setup](#database-setup)
- [Seed data](#seed-data)
- [Running the app](#running-the-app)
- [API documentation](#api-documentation)
- [Matching algorithm](#matching-algorithm)
- [Database schema](#database-schema)
- [Demo-user mechanism](#demo-user-mechanism)
- [Assumptions](#assumptions)
- [Known limitations](#known-limitations)
- [Future improvements](#future-improvements)
- [Deployment](#deployment)

---

## Live Demo

[Open FluentFeed Practice Partners](https://fluentfeed-practice-partners.onrender.com/)

> Hosted on Render's free tier — the first request after a period of
> inactivity may take a few seconds to wake the service up.

## Features

1. **User profile** — name, English level, learning goal, native language, country, preferred practice time, bio. Full create/read/update.
2. **Partner matching** — a deterministic, backend-calculated compatibility score (see [Matching algorithm](#matching-algorithm)) ranks every other user, returns the top 5, with human-readable match reasons.
3. **Search & filters** — browse and filter all users by English level, learning goal, and country, independent of the matching algorithm.
4. **Connection requests** — send, accept, reject; self-connection and duplicate-request protection; only the receiver can respond to a request.
5. **Practice Mission** — once connected to at least one partner, get a random discussion topic from a fixed list of 15, with a 5-minute suggested duration.

No real authentication — see [Demo-user mechanism](#demo-user-mechanism).

## Tech stack

**Client:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios
**Server:** Node.js, Express, TypeScript, MongoDB, Mongoose
**Security/prod:** Helmet, express-rate-limit

## Architecture

```
fluentfeed/
├── client/    React SPA — pages, components, hooks, services, context
└── server/    Express API — routes → controllers → services → models
```

The backend is strictly layered: **routes** only wire up HTTP verbs to
controllers; **controllers** only handle request/response and call a
service; all business logic (matching math, connection rules, filtering)
lives in **services**; **models** are Mongoose schemas with their own
validation. This keeps business logic out of both the route files and
React.

The frontend has a matching separation: **services/** wrap every API call,
**hooks/** hold data-fetching and state logic per feature, **pages/**
compose hooks + components, and a shared **CurrentUserContext** carries
the active demo user across the whole app.

## Installation

```bash
git clone https://github.com/Rutikyadav71/fluentfeed-practice-partners.git
cd fluentfeed-practice-partners

cd client && npm install
cd ../server && npm install
```

## Environment variables

Copy `.env.example` to `server/.env` and fill in your values:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fluentfeed
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

- `MONGODB_URI` / `CLIENT_URL` fall back to sensible localhost defaults in
  development, but are **required with no fallback in production** — the
  server refuses to start if either is missing when `NODE_ENV=production`.
- Never commit `.env` — it's already covered by `.gitignore`.

## Database setup

Any MongoDB instance works — a local install or a free MongoDB Atlas
cluster. Point `MONGODB_URI` at it. Collections (`users`, `connections`)
are created automatically on first write; no manual schema setup needed.

## Seed data

```bash
cd server
npm run seed
```

This clears the `users` and `connections` collections and inserts 18 demo
users with deliberate overlap across English level, learning goal,
country, native language, and preferred time — enough variation that the
matching algorithm produces a realistic spread of scores instead of
everyone landing at 0% or 100%.

> To seed the **production** database, point your local `MONGODB_URI` at
> the same Atlas connection string used in production, then run
> `npm run seed` from your machine — the script just connects and writes,
> it doesn't matter where it's run from.

## Running the app

**Development** (two terminals):

```bash
# Terminal 1
cd server && npm run dev      # http://localhost:5000

# Terminal 2
cd client && npm run dev      # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000`.

**Production build:**

```bash
cd client && npm run build    # outputs client/dist
cd ../server && npm run build # outputs server/dist

# with NODE_ENV=production set (in server/.env or the shell)
npm start
```

In production the Express server serves the built client directly from
`client/dist` and answers `/api/*` itself — one process, one origin, no
CORS layer needed. See [Deployment](#deployment).

## API documentation

All responses follow one envelope:

```json
// success
{ "success": true, "data": { }, "message": "..." }
// error
{ "success": false, "message": "..." }
```

The demo-user mechanism means every endpoint below except `POST
/api/profile` and `GET /api/users` expects an `x-user-id` header set to a
valid user's `_id`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Liveness check |
| POST | `/api/profile` | Create a profile |
| GET | `/api/profile` | Get the current user's profile |
| PUT | `/api/profile` | Update the current user's profile |
| GET | `/api/users` | List/filter users |
| GET | `/api/matches` | Top 5 compatible partners for the current user |
| POST | `/api/connections` | Send a connection request |
| GET | `/api/connections` | List incoming/outgoing/connected |
| PUT | `/api/connections/:id` | Accept or reject an incoming request |

**POST /api/profile**
```json
// body
{ "name": "Rahul Sharma", "englishLevel": "Intermediate", "learningGoal": "IELTS",
  "nativeLanguage": "Hindi", "country": "India", "preferredTime": "Evening",
  "bio": "Preparing for IELTS and looking for a speaking partner." }
// 201 → created user, or 400 on validation failure
```

**GET /api/users?englishLevel=Intermediate&learningGoal=IELTS&country=India**
All three query params optional, combinable. `country` matches case-insensitively.

**GET /api/matches**
```json
{ "success": true, "data": [
  { "_id": "...", "name": "Priya Patel", "matchScore": 85,
    "matchReasons": ["Same learning goal", "Same English level", "Same country"], "...": "..." }
] }
```

**POST /api/connections**
```json
// body: { "receiverId": "..." }
// 201 on success
// 400 — self-connection or missing receiverId
// 404 — receiver doesn't exist
// 409 — already pending or already connected
```

**PUT /api/connections/:id**
```json
// body: { "status": "accepted" | "rejected" }
// 400 — invalid status, or you're not the receiver
// 409 — already responded to
```

## Matching algorithm

Implemented once, server-side, in `matchingService.ts`:

```
score = 0
+40 if learningGoal matches
+25 if englishLevel matches
+20 if preferredTime matches
+10 if country matches
+5  if nativeLanguage matches
```

`GET /api/matches` scores every other user, sorts descending, returns the
top 5 with a `matchScore` (0–100) and a `matchReasons` array naming which
fields matched. The weights are never duplicated or reimplemented in
React — the frontend only ever displays what the API returns.

## Database schema

**User**
| Field | Type | Notes |
|---|---|---|
| name | String | required, 2–80 chars |
| englishLevel | enum | Beginner / Intermediate / Advanced |
| learningGoal | enum | IELTS / TOEFL / Job Interview / Daily Communication / Business English |
| nativeLanguage | String | required |
| country | String | required, indexed |
| preferredTime | enum | Morning / Afternoon / Evening / Night |
| bio | String | required, 10–300 chars |
| createdAt / updatedAt | Date | automatic |

**Connection**
| Field | Type | Notes |
|---|---|---|
| senderId | ObjectId → User | |
| receiverId | ObjectId → User | |
| status | enum | pending / accepted / rejected |
| pairKey | String | normalized `sorted(senderId, receiverId)`, see below |
| createdAt / updatedAt | Date | automatic |

A partial **unique index** on `pairKey` (filtered to `status: pending |
accepted`) guarantees only one active connection can ever exist between
any two users, enforced by the database itself — not just the
application-level duplicate check — which closes a race condition where
two near-simultaneous requests between the same pair could otherwise both
succeed.

## Demo-user mechanism

There's no real authentication. Instead:

- A "Current User" switcher in the navbar lists every seeded user by name.
- Selecting one sets `currentUserId` in `CurrentUserContext` (persisted to
  `localStorage`), and every subsequent API request carries it as the
  `x-user-id` header via an Axios interceptor.
- Switching users immediately re-fetches profile, matches, and
  connections everywhere in the app — nothing is faked client-side; every
  screen still reads from MongoDB through the real API.

## Assumptions

- A "profile" and a "user" are the same document — creating a profile
  creates a user record; there's no separate signup step.
- Match scores and connection state are always computed fresh from the
  database on request; nothing is cached or precomputed.
- The Practice Mission topic list is static and rendered client-side (see
  [Known limitations](#known-limitations)) rather than served by an API
  endpoint, since it doesn't depend on any per-user or per-connection
  state.

## Known limitations

- **No real authentication.** Anyone can act as any seeded user by
  selecting them in the switcher. Fine for a demo, not for production use
  without adding real auth.
- **No automated tests.** See [Future improvements](#future-improvements)
  and `MANUAL_TESTING.md` for the manual test checklist used instead.
- **Mission topics aren't tied to a specific connection.** They're a
  random pick from a fixed list shown to whichever user is logged in —
  there's no shared "this is today's mission for you and Priya"
  persisted state between two users.
- **Single-origin CORS in dev.** Only one `CLIENT_URL` is allowed at a
  time; fine for local dev and typical single-frontend deployments, not
  for multiple simultaneous frontend origins.
- **Free-tier hosting sleeps on inactivity.** The live demo runs on
  Render's free tier, which spins down after 15 minutes with no traffic;
  a keep-alive ping (cron-job.org, every 10 minutes) is used to mitigate
  this, but the very first request after a longer gap may still be slow.

## Future improvements

- Real authentication (sessions or JWT)
- Real-time messaging between connected partners
- Voice/video calling for practice sessions
- Push notifications for new requests/messages
- AI-generated (rather than static) mission topics
- Smarter recommendations beyond the fixed weighted score
- Pagination on `/api/users` for large datasets
- Usage analytics
- Automated test suite (unit + integration)
- Production monitoring/alerting

## Deployment

The server can serve the built client itself, so the simplest deployment
is a single Node process — this is exactly how the live demo above is
hosted.

### How this project is deployed

- **Hosting:** Render (single Web Service) — the Express server serves
  the built React app directly from `client/dist`, so no separate static
  host is needed.
  - Build command: `cd client && npm install && npm run build && cd ../server && npm install && npm run build`
  - Start command: `cd server && npm start`
  - Environment variables set on Render: `NODE_ENV=production`,
    `MONGODB_URI`, `CLIENT_URL`
- **Database:** MongoDB Atlas free (M0) cluster. Network access is set to
  allow all IPs (`0.0.0.0/0`) since Render's free-tier outbound IP isn't
  fixed.
- **Uptime:** Render's free tier sleeps after 15 minutes of inactivity; a
  free cron-job.org job pings `/api/health` every 10 minutes to keep the
  service warm.

### General self-hosted deployment (alternative)

1. Set production environment variables (`NODE_ENV=production`,
   `MONGODB_URI` pointing at your production database, `CLIENT_URL` if
   you still want CORS enabled for any external origin — normally
   unnecessary once the server serves the client directly).
2. Build both apps:
   ```bash
   cd client && npm run build
   cd ../server && npm run build
   ```
3. Start the server:
   ```bash
   npm start
   ```
   With `NODE_ENV=production`, Express serves `client/dist` for all
   non-`/api` routes and answers `/api/*` itself — one process, one port,
   no separate static host or reverse proxy required.
4. Point your process manager (PM2, systemd, a container orchestrator,
   etc.) at `server/dist/server.js` and make sure `NODE_ENV=production`
   and your Mongo URI are set in that environment.

If you'd rather host the frontend and backend separately (e.g. a static
host for `client/dist` plus a separate API host), set `CLIENT_URL` to the
frontend's real origin so CORS allows it, and point the frontend's API
calls at the backend's URL instead of relying on the dev-only Vite proxy.
