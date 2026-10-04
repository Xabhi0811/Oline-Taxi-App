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
