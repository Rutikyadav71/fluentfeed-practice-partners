# FluentFeed — Manual Test Checklist

Automated tests are intentionally out of scope for this build (see README →
Future Improvements). This checklist is the Phase 16 deliverable in their
place: a repeatable manual pass covering every endpoint, every validation
rule, and every UI state. Run it after any significant change, and always
before a deploy.

Run `npm run seed` in `server/` first so there's more than one user to test
matching/connections against.

---

## 1. Health & wiring

- [ ] `GET /api/health` → `200`, `{ success: true, data: { status: "ok" } }`
- [ ] `GET /api/does-not-exist` → `404`, `{ success: false, message: "Route not found: GET /api/does-not-exist" }`
- [ ] Stop MongoDB, restart the server → logs a clear connection error and exits (does not hang)

## 2. Profile API (`/api/profile`)

- [ ] `POST /api/profile` with a full valid body → `201`, returns the created user with `_id`
- [ ] `POST /api/profile` with `englishLevel: "Expert"` (invalid enum) → `400` with a readable message, not a raw Mongo stack trace
- [ ] `POST /api/profile` with `bio` under 10 characters → `400`
- [ ] `POST /api/profile` missing `name` entirely → `400`
- [ ] `GET /api/profile` with no `x-user-id` header → `400`
- [ ] `GET /api/profile` with a made-up 24-char hex id → `404`
- [ ] `GET /api/profile` with a malformed id (e.g. `abc123`) → `400`, not a 500
- [ ] `GET /api/profile` with a valid `x-user-id` → `200` with that user's data
- [ ] `PUT /api/profile` updating only `bio` → `200`, other fields unchanged
- [ ] `PUT /api/profile` with an invalid enum value → `400`

## 3. User search & filters (`/api/users`)

- [ ] `GET /api/users` (no query) → all users
- [ ] `GET /api/users?englishLevel=Intermediate` → only Intermediate users
- [ ] `GET /api/users?learningGoal=IELTS&country=India` → only users matching both
- [ ] `GET /api/users?country=india` (lowercase) → still matches "India" (case-insensitive)
- [ ] Filtering by a level/goal that matches nobody → `200` with an empty array, not an error

## 4. Matching (`/api/matches`)

- [ ] With only 1 user seeded → `200` with an empty array (no candidates to compare against)
- [ ] With 2+ users → results sorted descending by `matchScore`
- [ ] Response never includes the current user's own id
- [ ] Response is capped at 5 results even with 18 seeded users
- [ ] Manually verify one score by hand against the weights (40/25/20/10/5) for a known pair from `demoUsers.ts`
- [ ] `matchReasons` array only lists the fields that actually matched — cross-check against the score

## 5. Connections (`/api/connections`)

- [ ] `POST /api/connections` with a valid `receiverId` → `201`, status `pending`
- [ ] `POST /api/connections` with `receiverId` equal to your own id → `400`
- [ ] `POST /api/connections` to the same receiver twice → second call → `409` "already pending"
- [ ] Send A→B, then try B→A before A's request is resolved → `409` (checked in both directions)
- [ ] `PUT /api/connections/:id` with `{status:"accepted"}` as the **sender** (not receiver) → `400`
- [ ] `PUT /api/connections/:id` with `{status:"accepted"}` as the **receiver** → `200`, status flips
- [ ] Try to accept/reject the same request twice → second call → `409` "already responded to"
- [ ] `PUT /api/connections/:id` with an invalid status string like `"maybe"` → `400`
- [ ] `GET /api/connections` returns three correctly-scoped buckets: `incoming`, `outgoing`, `connected`
- [ ] **Race condition check**: fire two connection requests between the same pair of users at nearly the same time (e.g. two terminal tabs, near-simultaneous `curl` calls) → only one should succeed; the second should fail (either the app-level 409 or a database-level unique constraint 409), never two active connections for the same pair

## 6. Frontend — Profile page

- [ ] Loading state shows briefly on first load
- [ ] Creating a profile with an empty required field shows inline validation, does not call the API
- [ ] Successful create shows a success banner and switches you into "update" mode
- [ ] Successful update shows a success banner
- [ ] Killing the backend mid-request shows the error banner, not a blank screen

## 7. Frontend — Matches page

- [ ] Top matches section shows a spinner, then cards, sorted by score
- [ ] Score badge color scales with score (green high / yellow mid / gray low)
- [ ] "Why you match" reasons match what the badge score implies
- [ ] Browse section filters update results without a full page reload
- [ ] Clicking Connect updates that card to "Request Sent" without needing a manual refresh
- [ ] A partner you're already connected to shows "✓ Connected" and a disabled button on load (not just after clicking)
- [ ] Empty filter results show the empty state, not a blank grid

## 8. Frontend — Connections page

- [ ] Incoming/Sent/Connected sections each show their own empty state when empty
- [ ] Accepting an incoming request moves it out of Incoming and into Connected without a page reload
- [ ] Rejecting removes it from Incoming (does not appear in Connected)
- [ ] Accept/Reject buttons show a loading state and are disabled while the request is in flight

## 9. Frontend — Mission page

- [ ] With zero connected partners → empty state with a link to Matches
- [ ] With 1+ connected partners → shows a topic, 5-minute duration, and instructions
- [ ] "Get a different topic" swaps the topic without a network request (client-side random pick)
- [ ] Connected partner chips list every currently connected partner

## 10. Demo-user switcher

- [ ] Switching users updates Dashboard, Profile, Matches, and Connections everywhere, immediately
- [ ] Switching to a user with no incoming requests shows the correct empty state, not stale data from the previous user
- [ ] With zero seeded users (`users` collection empty) → switcher shows "No demo users found" instead of crashing

## 11. Responsive check

- [ ] 375px width (mobile): nav collapses to hamburger, cards stack single-column, no horizontal scroll
- [ ] 768px width (tablet): partner cards go 2-column, forms remain usable
- [ ] 1280px+ (desktop): full nav visible, layout doesn't over-stretch past its max-width containers
