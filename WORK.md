# Project work log — 2026-10-04

## Setup

- Use the committed npm lockfiles: `cd Backend && npm ci`; `cd Frontend && npm ci`.
- Configure `DB_CONNECT`, `JWT_SECRET`, `GOOGLE_MAPS_API`, and `PORT` in `Backend/.env`; configure `VITE_BACKEND_URL` and `VITE_SOCKET_URL` in `Frontend/.env`. Keep values private.
- Start with `cd Backend && node server.js` and `cd Frontend && npm run dev`.
- Both services started on ports 4000 and 5173. The backend reported a successful MongoDB connection.

## Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Backend dependencies | Pass | `cd Backend && npm ci --no-audit --no-fund`: 143 packages, exit 0. |
| Frontend dependencies | Pass | `cd Frontend && npm ci --no-audit --no-fund`: 229 packages, exit 0. |
| Backend syntax | Pass | `node --check` on every backend `.js` file, exit 0. |
| Backend tests | Pass | `cd Backend && npm test`: 4 tests passed. |
| Frontend build | Pass | `cd Frontend && npm run build`: Vite built 148 modules, exit 0. |
| Frontend lint | Pass | `cd Frontend && npm run lint`: exit 0. Initially failed with 24 errors and 2 warnings; those were fixed. |
| Backend startup and database | Pass | `node server.js`: port 4000 listening; `connected to DB` logged. |
| Backend root | Pass | `GET http://localhost:4000/`: HTTP 200, `hello`. |
| Unauthenticated API access | Pass | `GET /users/profile` and `GET /rides/get-fare`: HTTP 401. |
| Invalid user signup | Pass | `POST /users/register` with invalid email and short password: HTTP 400. |
| Frontend startup | Pass | `npm run dev`; `GET http://localhost:5173/`: HTTP 200 HTML. |
| Typecheck | Blocked | No typecheck script or TypeScript source. |
| Browser and live ride flows | Blocked | Browser automation is unavailable; live booking would write to the configured database and call the external Maps API. |

## Fixes made

- Removed a credential-looking Google Maps key from the README example. If real, rotate or revoke it; the old value remains in Git history.
- Made displayed fares use the same per-vehicle calculation as booked rides.
- Saved and validated the selected vehicle type on rides.
- Corrected the captain ride-start token and signup login link.
- Removed registration logging that printed submitted passwords.
- Made ride confirmation and OTP start conditional on the ride's current status and requesting captain, preventing duplicate acceptance and wrong-captain starts.
- Resolved frontend lint errors and separated React contexts from provider components.
- Added backend tests for fare calculations, ride vehicle-type validation, and ride transition filters.

## Remaining issues, in priority order

1. **Socket identity can be spoofed.** [Backend/socket.js](Backend/socket.js) accepts client-supplied IDs for `json`, `update-captain-socket-id`, and `update-location-captain` without verifying a token. Authenticate each socket and derive identity from its verified token.
2. **Ride completion is missing.** [Backend/routes/ride.routes.js](Backend/routes/ride.routes.js) has no `/end` route although the README and UI describe completion. Implement and test it.
3. **Socket registration can race connection.** [Frontend/src/Pages/Home.jsx](Frontend/src/Pages/Home.jsx) emits registration when the socket object exists, even if disconnected. Register on connect and reconnect. [Frontend/src/Pages/CaptainHome.jsx](Frontend/src/Pages/CaptainHome.jsx) sends `userId` to a handler expecting `captainId`.
4. **Fare errors are hidden.** [Frontend/src/Pages/Home.jsx](Frontend/src/Pages/Home.jsx) opens the vehicle panel before fare retrieval succeeds and only logs errors. Show the error and prevent booking until fares load.
5. **Ride creation can leave orphan records.** [Backend/controllers/ride.controller.js](Backend/controllers/ride.controller.js) saves a ride before geocoding and captain lookup. If either external step fails, it responds with HTTP 500 but leaves the pending ride stored. Validate external prerequisites first or provide rollback/retry behavior.
6. **Documentation differs from code.** [README.md](README.md) mentions routes and features that are absent or named differently, including `/rides/fare`, `/rides/start`, and ride history. Update it after implementing the full flow.

## Prompt for an AI coding model

> Continue from `WORK.md`. Inspect the current code and Git diff first. Reproduce each remaining issue before changing it. Prioritize authenticated Socket.IO identity, then implement ride completion and repair frontend socket registration and error handling. Add tests for unauthorized socket updates, two captains accepting the same ride, wrong-captain OTP start, fare display consistency, and ride completion. Run `npm test` in Backend, `npm run lint` and `npm run build` in Frontend, start both servers, and exercise safe API flows. Record exact commands and outcomes in `WORK.md`; mark flows requiring browser access, database writes, or external API calls as blocked unless they are actually exercised. Keep secrets out of logs and preserve unrelated edits.

## Security hardening session - 2026-10-06

This section supersedes the earlier remaining-issues list. Work began with a clean tracked working tree. Existing code, root/package README files, WORK.md, scripts, routes, UI fields and tests were inspected before edits. No applicable AGENTS.md was found in the repository or its parent. No configured database contents or .env values were printed. The Windows sandbox initially failed to create a process (apply deny-read ACLs); reviewed escalated commands were used thereafter.

### Implementation

- Added explicit captainRide, riderRide and rideOffer allow-list DTOs. Every ride HTTP response and ride socket notification uses a DTO, including reads, start and completion. Populated user/captain queries select only display/routing fields. Captain payloads omit OTP and private profile/ride fields; rider-only pending/accepted responses retain OTP.
- Persisted offeredCaptains. Offers require a connected captain within 5 km, a location update within five minutes, matching vehicle, and no accepted/ongoing ride at offer time. Atomic acceptance filters by pending status, offered captain ID and current vehicle type; competing requests yield exactly one winner.
- New-ride offers contain only _id, pickup, destination, fare and rider fullname, matching captain UI needs.
- Removed location/profile/upstream response logging, raw Axios error logging and credential-echoing validation errors. Removed GET /rides/start-ride; the UI already uses POST /rides/start with JSON OTP.
- Added shared per-IP limits: signup/login 20/15 minutes; Maps/fare/booking 60/minute; OTP start 20/15 minutes. Added input/body bounds, Google request timeout/abort/size/redirect limits, external schema validation, HTTP server timeouts and frontend request timeout.
- Moved database connection out of app import into server startup, allowing disposable fixtures and preventing listening before database readiness.
- Added rider/captain home and ride-screen recovery on socket ready and page reload; debounced autocomplete and removed duplicate suggestion calls.
- Added real MongoDB/HTTP/Socket.IO integration tests plus a repeatable Chrome browser script with isolated API/Vite servers. All fixtures use disposable MongoDB and mocked Maps; the configured database is never used.
- Replaced stale documentation with implemented routes and explicit limitations.

### Dependency review and decisions

Initial npm audit --json returned findings in root, Backend and Frontend (Backend: 16, Frontend: 26). Applicability was reviewed against imports and routes before running npm audit fix without --force:

| Finding group | Applicability in this repository |
| --- | --- |
| Socket.IO parser/Engine.IO/ws exhaustion | Exposed backend socket transport; directly relevant. Frontend socket.io server package is not imported, but was still updated transitively. |
| Axios resource limits, redirect credentials, proxy/prototype gadgets | Backend uses fixed Google HTTPS endpoints, not caller-controlled URLs; no multipart or streamed uploads. Many exploit prerequisites are absent. Response bounds/timeouts and redirect rejection still matter. Browser uses Axios; all copies updated. |
| Mongoose sanitizeFilter/update casting | Routes construct fixed filters and updates rather than accepting arbitrary query objects. NoSQL/prototype advisories have reduced direct applicability; updated within Mongoose 8 anyway. |
| jws HMAC verification | Authentication dependency; patched transitively. App uses jsonwebtoken rather than calling jws verification directly. |
| proxy-addr, qs, path-to-regexp, validator | trust proxy remains disabled; no complex wildcard routes or URL validation. Request parsing is exposed, so compatible fixes were retained and URL-encoded parsing simplified. |
| Lodash template/prototype gadgets | No app calls to vulnerable template/omit/unset APIs found; patched transitively. |
| React Router | Client-side BrowserRouter; no SSR, server actions, manifest or single-fetch endpoints. Redirect/path behavior remains relevant; updated within 7. |
| Vite | Development server advisories, including Windows paths, are relevant to local development; updated within 7. |
| Babel, PostCSS, Rollup, tar, glob/YAML/ESLint/source-map helpers | Build/development-time exposure, usually requiring hostile source, config, maps or archives; not the public application API. Compatible fixes retained. |
| form-data and follow-redirects | No app multipart uploads; Google redirects now disabled. Patched even though triggering paths are restricted. |

Direct minimum versions now include Axios 1.20.0, Mongoose 8.24.5, express-validator 7.3.2, React Router DOM 7.18.4, Vite 7.3.7 and Tailwind 4.3.3. Added express-rate-limit and development-only mongodb-memory-server, socket.io-client and Playwright.

Rollup 4.64.0 from the initial compatible audit fix stalled the production build during transformation with high memory/CPU usage. Bounded Tailwind scanning, removing Tailwind in no-output diagnostic builds, excluding CSS, and separately externalizing Axios/React Router did not resolve it. A loopback-only inspector CPU sample showed heavy garbage collection. Pinning Rollup to 4.59.0 fixed the build (5.17 seconds on first successful run; 4.04 seconds after clean install), with zero audit findings. This is an observed workspace compatibility result, not a claim that all Rollup 4.64 installations fail. The override is in Frontend/package.json.

References: [Rollup security fix in 4.59.0](https://github.com/rollup/rollup/security/advisories/GHSA-mw96-cpmx-2vgc), [Tailwind source scanning](https://tailwindcss.com/docs/detecting-classes-in-source-files).

The repository tracked 4,035 installed files under node_modules and Backend/node_modules despite an existing node_modules ignore rule. Ran git rm -r --cached --quiet --ignore-unmatch -- Backend/node_modules node_modules. Those removals are staged; installed files remain on disk. No source change was committed. Lockfiles and npm ci now provide the dependency artifacts.

### Commands and results

Commands below use the indicated working directory. Independent checks ran concurrently where appropriate.

| Directory | Exact command | Result |
| --- | --- | --- |
| Root | git status --short | Initially clean. |
| Root | rg --files -g AGENTS.md -g README.md -g WORK.md -g package.json -g '*test*' -g '!node_modules' -g '!package-lock.json' | Inspected documentation, scripts and existing tests; later source inspection excluded .env files. |
| Backend | npm test | Before editing: 4/4 passed. First integrated run: 14/14 passed, with teardown cleanup warnings; cleanup ordering was fixed. Next run: 15/15 passed without those warnings. |
| Frontend | npm run lint; npm run build | Before editing: lint passed; 150 modules built in 3.66s. |
| Root, Backend, Frontend | npm audit --json | Initial findings reviewed above; exit 1. Frontend report was also summarized with ConvertFrom-Json to inspect advisory titles. |
| Root, Backend, Frontend | npm audit fix --no-fund | Compatible updates only, no --force; each reported zero findings afterward. |
| Backend | npm install express-rate-limit@^8 --no-fund | Passed; zero findings. |
| Backend | npm install --save-dev mongodb-memory-server@^10 socket.io-client@^4 --no-fund | Passed; zero findings. |
| Backend | npm install --save-dev playwright@^1 --no-fund | Passed; zero findings. |
| Frontend | npm run lint; npm run build | Lint passed; Rollup 4.64 build stalled and was stopped. Additional no-output diagnostic builds also stalled and were stopped. |
| Frontend | npm update tailwindcss @tailwindcss/vite --no-fund | Compatible Tailwind update; zero findings. Did not by itself fix build. |
| Frontend | npm pkg set overrides.rollup=4.59.0; npm install --no-fund; npm run build | Passed; 156 modules, build 5.17s; zero findings. |
| Root, Backend, Frontend | npm install --package-lock-only --no-fund; npm ci --no-fund | Passed for all three: root 27 packages, Backend 184, Frontend 224 installed. Backend binary postinstall took about 3 minutes. |
| Frontend | npm run lint; npm run build; npm audit | Final clean-install run passed: lint exit 0, build 156 modules in 4.04s, audit zero findings. |
| Root | npm audit | Final clean-install run: zero findings. |
| Backend | npm run test:browser | First run passed all seven reported browser stages; final clean-install result recorded below. |
| Root | git diff --check -- . ':!**/node_modules/**' ':!node_modules/**' | Passed after normalizing changed text files. |
| Root | git ls-files '*node_modules*' | No tracked installed dependency files remain. |

### Verification scope

The automated HTTP/socket fixture executes signup/login for both roles, fare, booking, minimal offers, stale/distant/disconnected offer filtering, unoffered and wrong-vehicle denial, two concurrent acceptances, HTTP captain OTP exclusion, rider-only ride-confirmed DTO, nested private-field exclusion, ownership/role authorization, invalid socket token, spoofed socket location IDs, reconnect identity registration, OTP recovery, wrong-captain/wrong-OTP start, completion and replay rejection. It also tests malformed/failed/empty Maps responses, no orphan booking, input bounds, rate-limit 429/Retry-After, and actual server.js startup with GET /health returning ready.

The Chrome script exercises actual React pages in two isolated browser contexts: rider and captain signup/login, fare validation and mocked outage display, booking, offer display, acceptance, rider OTP visibility, accepted-state reload/reconnect for both roles, wrong and correct OTP submission, ongoing-state reload, completion notification and unauthenticated captain-route redirect. It asserts no uncaught browser exceptions. Test passwords/tokens/OTPs are kept in memory and not printed.

Live Google Maps credentials/billing/network behavior, physical-device geolocation, external imagery, production database/service deployment and payment processing were not exercised. Maps/geolocation used fixtures; external image requests were blocked. No claim is made that these external-service steps passed.

### Remaining risks and compatibility notes

- Existing pending rides without offeredCaptains fail closed and need rebooking. Captain locations need a fresh update before new offers.
- Offer persistence means eligibility at offer time; no expiry/re-delivery exists. Availability checks do not prevent a captain accepting two different already-offered rides concurrently. Per-ride competing acceptance is atomic and tested.
- Socket routing stores one current socket per account. Multi-device delivery, distributed socket adapters and durable notification replay are not implemented. Authorized HTTP recovery handles remembered ride IDs, not a ride-history listing.
- Rate-limit stores are in-process and per IP; shared stores and explicit trusted-proxy configuration are needed for multi-instance/proxy deployment. IP-based limits alone are not a complete distributed abuse defense.
- JWTs remain in browser localStorage; active sockets are checked at connection/reconnection, not automatically disconnected on logout/expiry. Infrastructure logging must redact query strings and request bodies.
- Backend Google timeout/size/redirect options and error sanitization are tested with mocked transport responses; real Google service latency and timeout timing were not measured.
- The Rollup compatibility override should be revisited when a newer audited version passes this workspace's build.
- The earlier log's credential-history warning still applies: removal from documentation cannot invalidate a previously exposed credential. No credential rotation was performed.
- No payment gateway, live rider map tracking, ratings or ride-history endpoint exists. README now says so.

### Final clean-install results

- Backend: npm test; npm audit -- 16 tests passed, 0 failed/skipped; test duration 20.62s; audit 0 vulnerabilities. Includes real server.js startup against disposable MongoDB and HTTP 200 /health with status ready.
- Backend: npm run test:browser -- exit 0. All seven PASS stages: both signups; both logins; fare/error/booking/notification/acceptance/OTP; accepted-state recovery; wrong/correct OTP start; ongoing recovery/completion; unauthorized redirect/no uncaught exceptions. This rerun used the final clean-installed Frontend dependencies and Rollup override.
- Frontend: npm run lint; npm run build; npm audit -- exit 0; build 156 modules in 4.04s; 0 vulnerabilities. The browser fixture also started Vite on a disposable loopback port and loaded actual React pages.
- Root: npm audit -- exit 0, 0 vulnerabilities.
- No live Maps call, configured-database write, production deployment or physical-device test was performed.
- Baseline and final checks are separate: the baseline had 4 Backend tests; the final suite has 16. No pre-existing test was removed.

### Changed files

Installed dependencies: 4,035 previously tracked files removed from the Git index under Backend/node_modules/ and node_modules/, retained on disk and ignored. The exact staged inventory is available with git diff --cached --name-only. Source, manifest, lockfile and documentation paths follow:

- Backend/README.md
- Backend/app.js
- Backend/controllers/captain.controller.js
- Backend/controllers/map.controller.js
- Backend/controllers/ride.controller.js
- Backend/controllers/user.controller.js
- Backend/db/db.js
- Backend/middlewares/rate-limit.js
- Backend/models/captain.module.js
- Backend/models/ride.module.js
- Backend/package-lock.json
- Backend/package.json
- Backend/routes/captain.routes.js
- Backend/routes/map.routes.js
- Backend/routes/ride.routes.js
- Backend/routes/user.routes.js
- Backend/scripts/browser-journey.cjs
- Backend/server.js
- Backend/services/fare.util.js
- Backend/services/map.service.js
- Backend/services/ride.dto.js
- Backend/services/ride.service.js
- Backend/socket.js
- Backend/test/journey.test.js
- Backend/test/ride.test.js
- Frontend/README.md
- Frontend/package-lock.json
- Frontend/package.json
- Frontend/src/Pages/CaptainHome.jsx
- Frontend/src/Pages/CaptainProtectWrapper.jsx
- Frontend/src/Pages/Home.jsx
- Frontend/src/Pages/UserLogout.jsx
- Frontend/src/Pages/useRide.js
- Frontend/src/componets/RidePopUp.jsx
- Frontend/src/index.css
- Frontend/src/main.jsx
- README.md
- WORK.md
- package-lock.json
- package.json
